import { Quaternion, Vector3 } from "three";
import { Molecule } from "../molecule/molecule";
import { BondWrapper } from "../bond-wrapper/bond-wrapper";
import { AtomWrapperWrapper } from "../atom-wrapper-wrapper/atom-wrapper-wrapper";

export class MoleculeWrapper {
    public molecule: Molecule | null = null;
    
    public position: Vector3 = new Vector3(0, 0, 0);
    public velocity: Vector3 = new Vector3(0, 0, 0);
    public rotation: Quaternion = new Quaternion();
    public angularVelocity: Vector3 = new Vector3(0, 0, 0);

    public bondWrappers: BondWrapper[] = [];
    public atomWrapperWrappers: AtomWrapperWrapper[] = [];

    public apparentPolarity: Vector3 = new Vector3(0, 0, 0);

    public constructor(molecule: Molecule, position: Vector3, velocity: Vector3, rotation: Quaternion) {
        this.molecule = molecule;
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
    }
}
