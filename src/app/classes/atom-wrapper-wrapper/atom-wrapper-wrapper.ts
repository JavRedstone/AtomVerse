import { Mesh, Vector3 } from "three";
import { AtomWrapper } from "../atom-wrapper/atom-wrapper";

export class AtomWrapperWrapper {
    public atomWrapper: AtomWrapper | null = null;
    public mesh: Mesh | null = null;

    public position: Vector3 = new Vector3(0, 0, 0); // for ions only
    public velocity: Vector3 = new Vector3(0, 0, 0); // for ions only
    public charge: number = 0; // for ions only

    public constructor(atomWrapper: AtomWrapper, mesh: Mesh) {
        this.atomWrapper = atomWrapper;
        this.mesh = mesh;
    }
}
