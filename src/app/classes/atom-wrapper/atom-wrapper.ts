import { Mesh, Quaternion, Vector3 } from "three";
import { Atom } from "../atom/atom";
import { Bond } from "../bond/bond";

export class AtomWrapper {
    public atom: Atom | null = null;
    public central: boolean = false;
    public bonds: Bond[] = [];
    public stericNumber: number = 0;
    public lonePairs: number = 0;

    public position: Vector3 | null = null;
    public velocity: Vector3 = new Vector3(0, 0, 0);
    public rotation: Quaternion = new Quaternion();

    public constructor(atom: Atom, central: boolean) {
        this.atom = atom;
        this.central = central;
    }
}
