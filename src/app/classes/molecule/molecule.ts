import { Vector3 } from "three";
import { Atom } from "../atom/atom";
import { Bond } from "../bond/bond";
import { AtomWrapper } from "../atom-wrapper/atom-wrapper";
import { VSEPR } from "../vsepr/vsepr";

export class Molecule {
    public name: string = '';
    public atomWrappers: AtomWrapper[] = [];
    public mass: number = 0;
    public bonds: Bond[] = [];
    public netDipoleMoment: Vector3 = new Vector3(0, 0, 0);
    public isHydrogenBonding: boolean = false;
    public type: number = 0;

    public static readonly COVALENT = 0;
    public static readonly IONIC = 1;
    public static readonly METALLIC = 2;

    public constructor(name: string, atomWrappers: AtomWrapper[], type: number) {
        this.name = name;
        this.atomWrappers = atomWrappers;
        for (let atomWrapper of this.atomWrappers) {
            if (atomWrapper.atom != null) {
                this.mass += atomWrapper.atom.atomicMass;
            }
        }
        this.type = type;
    }

    public bond(atomWrapperIdx1: number, atomWrapperIdx2: number, bondNumber: number, type: number): Molecule {
        let bond: Bond = new Bond(this.atomWrappers[atomWrapperIdx1], this.atomWrappers[atomWrapperIdx2], bondNumber, type);
        this.atomWrappers[atomWrapperIdx1].bonds.push(bond);
        this.atomWrappers[atomWrapperIdx2].bonds.push(bond);
        if (bond.atomWrapper1 != null && bond.atomWrapper2 != null && bond.atomWrapper1.atom != null && bond.atomWrapper2.atom != null) {
            if (
                [Atom.FLUORINE, Atom.OXYGEN, Atom.NITROGEN].includes(bond.atomWrapper1.atom) && bond.atomWrapper2.atom == Atom.HYDROGEN ||
                [Atom.FLUORINE, Atom.OXYGEN, Atom.NITROGEN].includes(bond.atomWrapper2.atom) && bond.atomWrapper1.atom == Atom.HYDROGEN
            ) {
                this.isHydrogenBonding = true;
            }
        }
        this.bonds.push(bond);
        return this;
    }

    public setVSEPRPositions(): Molecule {
        for (let atomWrapper of this.atomWrappers) {
            if (atomWrapper.central) {
                VSEPR.setAtomWrapperPositions(atomWrapper);
            }
        }
        for (let atomWrapper of this.atomWrappers) {
            if (atomWrapper.central) {
                for (let bond of atomWrapper.bonds) {
                    if (bond.atomWrapper1 != null && bond.atomWrapper2 != null && bond.atomWrapper1.position != null && bond.atomWrapper2.position != null) {
                        let dipoleMoment: Vector3 = new Vector3();
                        dipoleMoment.subVectors(bond.atomWrapper1.position, bond.atomWrapper2.position).normalize();
                        dipoleMoment.multiplyScalar(bond.polarity);
                        this.netDipoleMoment.add(dipoleMoment);
                    }
                }
            }
        }
        return this;
    }

    public static readonly HELIUM = new Molecule('Helium', [
        new AtomWrapper(Atom.HELIUM, true)
    ], Molecule.COVALENT)
        .setVSEPRPositions();

    public static readonly OXYGEN = new Molecule('Oxygen', [
        new AtomWrapper(Atom.OXYGEN, true),
        new AtomWrapper(Atom.OXYGEN, true)
    ], Molecule.COVALENT)
        .bond(0, 1, 2, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly HYDROGEN = new Molecule('Hydrogen', [
        new AtomWrapper(Atom.HYDROGEN, true),
        new AtomWrapper(Atom.HYDROGEN, true)
    ], Molecule.COVALENT)
        .bond(0, 1, 1, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly WATER = new Molecule('Water', [
        new AtomWrapper(Atom.OXYGEN, true),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false)
    ], Molecule.COVALENT)
        .bond(0, 1, 1, Bond.COVALENT)
        .bond(0, 2, 1, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly CARBON_MONOXIDE = new Molecule('Carbon Monoxide', [
        new AtomWrapper(Atom.CARBON, true),
        new AtomWrapper(Atom.OXYGEN, true)
    ], Molecule.COVALENT)
        .bond(0, 1, 3, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly CARBON_DIOXIDE = new Molecule('Carbon Dioxide', [
        new AtomWrapper(Atom.CARBON, true),
        new AtomWrapper(Atom.OXYGEN, false),
        new AtomWrapper(Atom.OXYGEN, false)
    ], Molecule.COVALENT)
        .bond(0, 1, 2, Bond.COVALENT)
        .bond(0, 2, 2, Bond.COVALENT)
        .setVSEPRPositions();
    
    public static readonly METHANE = new Molecule('Methane', [
        new AtomWrapper(Atom.CARBON, true),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false)
    ], Molecule.COVALENT)
        .bond(0, 1, 1, Bond.COVALENT)
        .bond(0, 2, 1, Bond.COVALENT)
        .bond(0, 3, 1, Bond.COVALENT)
        .bond(0, 4, 1, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly ETHANOL = new Molecule('Ethanol', [
        new AtomWrapper(Atom.CARBON, true),
        new AtomWrapper(Atom.CARBON, true),
        new AtomWrapper(Atom.OXYGEN, true),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false),
        new AtomWrapper(Atom.HYDROGEN, false)
    ], Molecule.COVALENT)
        .bond(0, 1, 1, Bond.COVALENT)
        .bond(1, 2, 1, Bond.COVALENT)
        .bond(0, 3, 1, Bond.COVALENT)
        .bond(0, 4, 1, Bond.COVALENT)
        .bond(0, 5, 1, Bond.COVALENT)
        .bond(1, 6, 1, Bond.COVALENT)
        .bond(1, 7, 1, Bond.COVALENT)
        .bond(2, 8, 1, Bond.COVALENT)
        .setVSEPRPositions();

    public static readonly SODIUM_CHLORIDE = new Molecule('Sodium Chloride', [
        new AtomWrapper(Atom.SODIUM, true),
        new AtomWrapper(Atom.CHLORINE, true)
    ], Molecule.IONIC)
        // .bond(0, 1, 1, Bond.IONIC);

    public static readonly POTASSIUM_CHLORIDE = new Molecule('Potassium Chloride', [
        new AtomWrapper(Atom.POTASSIUM, true),
        new AtomWrapper(Atom.CHLORINE, true)
    ], Molecule.IONIC)
        // .bond(0, 1, 1, Bond.IONIC);

    public static readonly CALCIUM_FLUORIDE = new Molecule('Calcium Fluoride', [
        new AtomWrapper(Atom.CALCIUM, true),
        new AtomWrapper(Atom.FLUORINE, false),
        new AtomWrapper(Atom.FLUORINE, false)
    ], Molecule.IONIC)
        // .bond(0, 1, 1, Bond.IONIC)
        // .bond(0, 2, 1, Bond.IONIC);

    public static readonly BERYLLIUM_OXIDE = new Molecule('Beryllium Oxide', [
        new AtomWrapper(Atom.BERYLLIUM, true),
        new AtomWrapper(Atom.OXYGEN, true)
    ], Molecule.IONIC)
        // .bond(0, 1, 1, Bond.IONIC)
        // .bond(0, 2, 1, Bond.IONIC);

    public static readonly MAGNESIUM_OXIDE = new Molecule('Magnesium Oxide', [
        new AtomWrapper(Atom.MAGNESIUM, true),
        new AtomWrapper(Atom.OXYGEN, true)
    ], Molecule.IONIC)
        // .bond(0, 1, 1, Bond.IONIC);
}
