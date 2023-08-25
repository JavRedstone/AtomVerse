import { Mesh } from "three";
import { Bond } from "../bond/bond";

export class BondWrapper {
    public bond: Bond | null = null;
    public meshes: Mesh[] = [];
    
    public constructor(bond: Bond, meshes: Mesh[]) {
        this.bond = bond;
        this.meshes = meshes;
    }
}
