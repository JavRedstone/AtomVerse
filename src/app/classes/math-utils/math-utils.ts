import { Quaternion, Vector3 } from "three";

export class MathUtils {
    public static readonly GAS_CONSTANT = 8.314; // joules / molK
    public static readonly AVOGADROS_NUMBER = 6.022e23; // atoms / mol

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value));
    }

    public static randRange(min: number, max: number, integer: boolean): number {
        if (integer) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        else {
            return MathUtils.clamp(Math.random() * (max - min + 1) + min, min, max);
        }
    }

    public static getRandomVector3(x1: number, x2: number, integerX: boolean, y1: number, y2: number, integerY: boolean, z1: number, z2: number, integerZ: boolean): Vector3 {
        let x: number = MathUtils.randRange(x1, x2, integerX);
        let y: number = MathUtils.randRange(y1, y2, integerY);
        let z: number = MathUtils.randRange(z1, z2, integerZ);
        return new Vector3(x, y, z);
    }

    public static getRandomQuaternion(): Quaternion {
        let axis: Vector3 = MathUtils.getRandomVector3(0, 1, false, 0, 1, false, 0, 1, false);
        let angle: number = MathUtils.randRange(0, 2 * Math.PI, false);
        return new Quaternion().setFromAxisAngle(axis, angle).normalize();
    }

    public static kgToAmu(kg: number) {
        return kg * 1000 * MathUtils.AVOGADROS_NUMBER;
    }

    public static amuToKg(amu: number) {
        return amu / (1000 * MathUtils.AVOGADROS_NUMBER);
    }

    public static kgToG(kg: number) {
        return kg * 1000;
    }

    public static gToKg(g: number) {
        return g / 1000;
    }

    public static ctoK(c: number) {
        return c + 273;
    }

    public static kToC(k: number) {
        return k - 273;
    }

    public static getVelocityFromKE(temperature: number, mass: number): number {
        let v = Math.sqrt((3 * MathUtils.GAS_CONSTANT * temperature) / MathUtils.gToKg(mass));
        return Number.isNaN(v) ? 0 : v;
    }
}
