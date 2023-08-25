import { Quaternion, Vector3 } from "three";
import { MoleculeWrapper } from "../molecule-wrapper/molecule-wrapper";
import { MathUtils } from "../math-utils/math-utils";
import { Molecule } from "../molecule/molecule";

export class Sim {
    public static readonly INITIAL_TEMPERATURE: number = 1 * 273;
    public static readonly INITIAL_PRESSURE: number = 1;
    public static readonly TICK_STEP: number = 0.02;
    public static readonly SPEED_MULTIPLIER: number = 2;
    public static readonly BOUNDS: Vector3 = new Vector3(2000, 2000, 2000);
    public static readonly BOUNDS_REPEL_FACTOR: number = 1e1;

    public static readonly RESTITUTION: number = 0.5;
    public static readonly ION_CONSTANT: number = 1e8;
    public static readonly DIPOLE_CONSTANT: number = 1e5;
    public static readonly HYDROGEN_CONSTANT: number = 1e8;
    public static readonly LDF_CONSTANT: number = 1e3;
    public static readonly MOLECULE_RADIUS: number = 250;

    public moleculeWrappers: MoleculeWrapper[] = [];
    public temperature: number = Sim.INITIAL_TEMPERATURE;
    public pressure: number = Sim.INITIAL_PRESSURE;

    public tickStep: number = Sim.TICK_STEP;
    public speedMultiplier: number = 1;
    public dt: number = this.tickStep * this.speedMultiplier;

    public simId: string | number | NodeJS.Timeout | undefined = undefined;

    public isStarted: boolean = false;
    public isPaused: boolean = true;

    public constructor() {}

    public start(): Sim {
        this.simId = setInterval(this.tick, this.tickStep);
        this.isStarted = true;
        this.isPaused = false;
        return this;
    }

    public stop(): Sim {
        if (this.simId != undefined) {
            clearInterval(this.simId);
            this.simId = undefined;
            this.isStarted = false;
            this.isPaused = true;
            this.temperature = Sim.INITIAL_TEMPERATURE;
            this.pressure = Sim.INITIAL_PRESSURE;
        }
        return this;
    }
    
    public resume(): Sim {
        this.dt = this.tickStep * this.speedMultiplier;
        this.isPaused = false;
        return this;
    }

    public pause(): Sim {
        this.dt = 0;
        this.isPaused = true;
        return this;
    }
    
    public speedUp(): Sim {
        this.speedMultiplier *= Sim.SPEED_MULTIPLIER;
        this.dt = this.tickStep * this.speedMultiplier;
        return this;
    }

    public slowDown(): Sim {
        this.speedMultiplier /= Sim.SPEED_MULTIPLIER;
        this.dt = this.tickStep * this.speedMultiplier;
        return this;
    }

    public resetSpeed(): Sim {
        this.speedMultiplier = 1;
        this.dt = this.tickStep * this.speedMultiplier;
        return this;
    }

    public tick(): Sim {
        if (this.dt > 0) {
            this.calculateVanDerWaals();
            
            this.repelByBounds();
            this.moveMolecules();
        }
        return this;
    }

    public calculateVanDerWaals() {
        for (let moleculeWrapper of this.moleculeWrappers) {
            if (moleculeWrapper.molecule != null) {
                for (let otherMoleculeWrapper of this.moleculeWrappers) {
                    if (otherMoleculeWrapper.molecule != null && moleculeWrapper != otherMoleculeWrapper) {
                        let hForce = 0;
                        if (moleculeWrapper.molecule.isHydrogenBonding && otherMoleculeWrapper.molecule.isHydrogenBonding) {
                            hForce = 1;
                        }

                        let distance: number = moleculeWrapper.position.distanceTo(otherMoleculeWrapper.position);
                        if (distance < Sim.MOLECULE_RADIUS * 2) {
                            moleculeWrapper.velocity.multiplyScalar(-Sim.RESTITUTION);
                            let d = Sim.MOLECULE_RADIUS * 2 - distance;
                            let unitVector = moleculeWrapper.position.clone().sub(otherMoleculeWrapper.position).normalize();
                            moleculeWrapper.position.add(unitVector.multiplyScalar(d / 2));
                        }
                        else {
                            let force: number = Sim.LDF_CONSTANT / (distance * distance * moleculeWrapper.molecule.mass)
                                + Sim.DIPOLE_CONSTANT * (moleculeWrapper.molecule.netDipoleMoment.length() * otherMoleculeWrapper.molecule.netDipoleMoment.length()) / (distance * distance * moleculeWrapper.molecule.mass)
                                + Sim.HYDROGEN_CONSTANT * hForce / (distance * distance * moleculeWrapper.molecule.mass);
                            let direction: Vector3 = otherMoleculeWrapper.position.clone().sub(moleculeWrapper.position).normalize();
                            moleculeWrapper.velocity.add(direction.multiplyScalar(force));
                        }

                        // only ion
                        for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
                            if (atomWrapperWrapper.atomWrapper != null && atomWrapperWrapper.atomWrapper.atom != null) {
                                for (let otherAtomWrapperWrapper of otherMoleculeWrapper.atomWrapperWrappers) {
                                    if (otherAtomWrapperWrapper.atomWrapper != null && otherAtomWrapperWrapper.atomWrapper.atom != null && atomWrapperWrapper != otherAtomWrapperWrapper) {
                                        let ionForce = 0;
                                        let charge1 = atomWrapperWrapper.atomWrapper.atom.valenceElectrons > 4 ? atomWrapperWrapper.atomWrapper.atom.valenceElectrons - 8 : atomWrapperWrapper.atomWrapper.atom.valenceElectrons;
                                        let charge2 = otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons > 4 ? otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons - 8 : otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons;
                                        let sign1 = Math.sign(charge1);
                                        let sign2 = Math.sign(charge2);
                                        if (sign1 == sign2) {
                                            ionForce = -Math.abs(charge1 + charge2);
                                        }
                                        else {
                                            ionForce = Math.abs(charge1 + charge2);
                                        }

                                        let distance: number = atomWrapperWrapper.position.distanceTo(otherAtomWrapperWrapper.position);
                                        if (distance < atomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius + otherAtomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius) {
                                            atomWrapperWrapper.velocity.multiplyScalar(-Sim.RESTITUTION);
                                            let d = atomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius + otherAtomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius - distance;
                                            let unitVector = atomWrapperWrapper.position.clone().sub(otherAtomWrapperWrapper.position).normalize();
                                            atomWrapperWrapper.position.add(unitVector.multiplyScalar(d / 2));
                                        }
                                        else {
                                            let force: number = Sim.LDF_CONSTANT / (distance * distance * atomWrapperWrapper.atomWrapper.atom.atomicMass)
                                                + Sim.ION_CONSTANT * ionForce / (distance * distance * atomWrapperWrapper.atomWrapper.atom.atomicMass);
                                            let direction: Vector3 = otherAtomWrapperWrapper.position.clone().sub(atomWrapperWrapper.position).normalize();
                                            atomWrapperWrapper.velocity.add(direction.multiplyScalar(force));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
                    if (atomWrapperWrapper.atomWrapper != null && atomWrapperWrapper.atomWrapper.atom != null) {
                        for (let otherAtomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
                            if (otherAtomWrapperWrapper.atomWrapper != null && otherAtomWrapperWrapper.atomWrapper.atom != null && atomWrapperWrapper != otherAtomWrapperWrapper) {
                                let ionForce = 0;
                                let charge1 = atomWrapperWrapper.atomWrapper.atom.valenceElectrons > 4 ? atomWrapperWrapper.atomWrapper.atom.valenceElectrons - 8 : atomWrapperWrapper.atomWrapper.atom.valenceElectrons;
                                let charge2 = otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons > 4 ? otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons - 8 : otherAtomWrapperWrapper.atomWrapper.atom.valenceElectrons;
                                let sign1 = Math.sign(charge1);
                                let sign2 = Math.sign(charge2);
                                if (sign1 == sign2) {
                                    ionForce = -(Math.abs(charge1) + Math.abs(charge2));
                                }
                                else {
                                    ionForce = Math.abs(charge1) + Math.abs(charge2);
                                }
                                
                                let distance: number = atomWrapperWrapper.position.distanceTo(otherAtomWrapperWrapper.position);
                                if (distance < atomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius + otherAtomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius) {
                                    atomWrapperWrapper.velocity.multiplyScalar(-Sim.RESTITUTION);
                                    let d = atomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius + otherAtomWrapperWrapper.atomWrapper.atom.vanDerWaalsRadius - distance;
                                    let unitVector = atomWrapperWrapper.position.clone().sub(otherAtomWrapperWrapper.position).normalize();
                                    atomWrapperWrapper.position.add(unitVector.multiplyScalar(d / 2));
                                }
                                else {
                                    let force: number = Sim.LDF_CONSTANT / (distance * distance * atomWrapperWrapper.atomWrapper.atom.atomicMass)
                                        + Sim.ION_CONSTANT * ionForce / (distance * distance * atomWrapperWrapper.atomWrapper.atom.atomicMass);
                                    let direction: Vector3 = otherAtomWrapperWrapper.position.clone().sub(atomWrapperWrapper.position).normalize();
                                    atomWrapperWrapper.velocity.add(direction.multiplyScalar(force));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public repelByBounds() {
        for (let moleculeWrapper of this.moleculeWrappers) {
            if (moleculeWrapper.molecule != null) {
                if (moleculeWrapper.molecule.type == Molecule.COVALENT) {
                    if (moleculeWrapper.position.x < -Sim.BOUNDS.x) {
                        // multiply by how much it's out of bounds so it looks like its bouncing
                        moleculeWrapper.velocity.x += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.x - moleculeWrapper.position.x);
                    }
                    else if (moleculeWrapper.position.x > Sim.BOUNDS.x) {
                        moleculeWrapper.velocity.x -= Sim.BOUNDS_REPEL_FACTOR * (moleculeWrapper.position.x - Sim.BOUNDS.x);
                    }
                    if (moleculeWrapper.position.y < -Sim.BOUNDS.y) {
                        moleculeWrapper.velocity.y += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.y - moleculeWrapper.position.y);
                    }
                    else if (moleculeWrapper.position.y > Sim.BOUNDS.y) {
                        moleculeWrapper.velocity.y -= Sim.BOUNDS_REPEL_FACTOR * (moleculeWrapper.position.y - Sim.BOUNDS.y);
                    }
                    if (moleculeWrapper.position.z < -Sim.BOUNDS.z) {
                        moleculeWrapper.velocity.z += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.z - moleculeWrapper.position.z);
                    }
                    else if (moleculeWrapper.position.z > Sim.BOUNDS.z) {
                        moleculeWrapper.velocity.z -= Sim.BOUNDS_REPEL_FACTOR * (moleculeWrapper.position.z - Sim.BOUNDS.z);
                    }
                }
                else if (moleculeWrapper.molecule.type == Molecule.IONIC) {
                    for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
                        if (atomWrapperWrapper.position.x < -Sim.BOUNDS.x) {
                            atomWrapperWrapper.velocity.x += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.x - atomWrapperWrapper.position.x);
                        }
                        else if (atomWrapperWrapper.position.x > Sim.BOUNDS.x) {
                            atomWrapperWrapper.velocity.x -= Sim.BOUNDS_REPEL_FACTOR * (atomWrapperWrapper.position.x - Sim.BOUNDS.x);
                        }
                        if (atomWrapperWrapper.position.y < -Sim.BOUNDS.y) {
                            atomWrapperWrapper.velocity.y += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.y - atomWrapperWrapper.position.y);
                        }
                        else if (atomWrapperWrapper.position.y > Sim.BOUNDS.y) {
                            atomWrapperWrapper.velocity.y -= Sim.BOUNDS_REPEL_FACTOR * (atomWrapperWrapper.position.y - Sim.BOUNDS.y);
                        }
                        if (atomWrapperWrapper.position.z < -Sim.BOUNDS.z) {
                            atomWrapperWrapper.velocity.z += Sim.BOUNDS_REPEL_FACTOR * (-Sim.BOUNDS.z - atomWrapperWrapper.position.z);
                        }
                        else if (atomWrapperWrapper.position.z > Sim.BOUNDS.z) {
                            atomWrapperWrapper.velocity.z -= Sim.BOUNDS_REPEL_FACTOR * (atomWrapperWrapper.position.z - Sim.BOUNDS.z);
                        }
                    }
                }
            }
        }
    }

    public moveMolecules() {
        for (let moleculeWrapper of this.moleculeWrappers) {
            if (moleculeWrapper.molecule != null) {
                if (moleculeWrapper.molecule.type == Molecule.COVALENT) {
                    if (moleculeWrapper.position != null) {
                        if (moleculeWrapper.velocity.length() >= MathUtils.getVelocityFromKE(this.temperature, moleculeWrapper.molecule.mass) * 2) {
                            moleculeWrapper.velocity.normalize().multiplyScalar(MathUtils.getVelocityFromKE(this.temperature, moleculeWrapper.molecule.mass) * 2);
                        }
                        else if (moleculeWrapper.velocity.length() <= MathUtils.getVelocityFromKE(this.temperature, moleculeWrapper.molecule.mass) / 2) {
                            moleculeWrapper.velocity.normalize().multiplyScalar(MathUtils.getVelocityFromKE(this.temperature, moleculeWrapper.molecule.mass) / 2);
                        }
                        moleculeWrapper.position.add(moleculeWrapper.velocity.clone().multiplyScalar(this.dt));
                    }
                    if (moleculeWrapper.rotation != null) {
                        let dr: Vector3 = moleculeWrapper.angularVelocity.clone().multiplyScalar(this.dt);
                        let dtheta: number = dr.length();
                        let drNormalized: Vector3 = dr.normalize();
                        let s: number = Math.sin(dtheta / 2);
                        let c: number = Math.cos(dtheta / 2);
                        let dQuat: Quaternion = new Quaternion(drNormalized.x * s, drNormalized.y * s, drNormalized.z * s, c);
                        moleculeWrapper.rotation.multiply(dQuat).normalize();
                    }
                }
                else if (moleculeWrapper.molecule.type == Molecule.IONIC) {
                    for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
                        if (atomWrapperWrapper.atomWrapper != null && atomWrapperWrapper.atomWrapper.atom != null) {
                            if (atomWrapperWrapper.velocity.length() >= MathUtils.getVelocityFromKE(this.temperature, atomWrapperWrapper.atomWrapper.atom.atomicMass) * 2) {
                                atomWrapperWrapper.velocity.normalize().multiplyScalar(MathUtils.getVelocityFromKE(this.temperature, atomWrapperWrapper.atomWrapper.atom.atomicMass) * 2);
                            }
                            else if (atomWrapperWrapper.velocity.length() <= MathUtils.getVelocityFromKE(this.temperature, atomWrapperWrapper.atomWrapper.atom.atomicMass) / 2) {
                                atomWrapperWrapper.velocity.normalize().multiplyScalar(MathUtils.getVelocityFromKE(this.temperature, atomWrapperWrapper.atomWrapper.atom.atomicMass) / 2);
                            }
                            atomWrapperWrapper.position.add(atomWrapperWrapper.velocity.clone().multiplyScalar(this.dt));
                        }
                    }
                }
            }
        }
    }

    public getRandomPosition() {
        return MathUtils.getRandomVector3(-Sim.BOUNDS.x, Sim.BOUNDS.x, false, -Sim.BOUNDS.y, Sim.BOUNDS.y, false, -Sim.BOUNDS.z, Sim.BOUNDS.z, false);
    }
    
    public getRandomVelocity(mass: number) {
        return MathUtils.getRandomVector3(-1, 1, false, -1, 1, false, -1, 1, false).normalize().multiplyScalar(MathUtils.getVelocityFromKE(this.temperature, mass));
    }
}
