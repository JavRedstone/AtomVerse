import { AtomWrapper } from "../atom-wrapper/atom-wrapper";

import { Mesh } from "three";

export class Bond {
    public atomWrapper1: AtomWrapper | null = null;
    public atomWrapper2: AtomWrapper | null = null;
    public numBonds: number = 0;
    public type: number = 0;
    public polarity: number = 0;
    public length: number = 0;

    public meshes: (Mesh | null)[] = [];

    public static readonly IONIC: number = 0;
    public static readonly COVALENT: number = 1;
    public static readonly METALLIC: number = 2;

    public constructor(atomWrapper1: AtomWrapper, atomWrapper2: AtomWrapper, numBonds: number, type: number) {
        this.atomWrapper1 = atomWrapper1;
        this.atomWrapper2 = atomWrapper2;
        this.numBonds = numBonds;
        this.type = type;
        if (this.atomWrapper1.atom != null && this.atomWrapper2.atom != null) {
            this.polarity = this.atomWrapper1.atom.electronegativity - this.atomWrapper2.atom.electronegativity; // if its positive, atom1 has partial negative
            this.length = this.atomWrapper1.atom.vanDerWaalsRadius + this.atomWrapper2.atom.vanDerWaalsRadius - 17.5 * this.numBonds;
        }
        else {
            this.polarity = 0;
            this.length = 0;
        }
    }
}
