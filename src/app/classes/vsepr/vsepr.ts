import { Quaternion, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { AtomWrapper } from "../atom-wrapper/atom-wrapper";

export class VSEPR {
    public static setAtomWrapperPositions(centralAtom: AtomWrapper): AtomWrapper {
        if (centralAtom.central) {
            if (centralAtom.position == null) {
                centralAtom.position = new Vector3(0, 0, 0);
            }
            centralAtom.lonePairs = VSEPR.findLonePairs(centralAtom);
            centralAtom.stericNumber = centralAtom.lonePairs + centralAtom.bonds.length;

            for (let bond of centralAtom.bonds) {
                if (bond.atomWrapper1 != null && bond.atomWrapper1 != centralAtom && bond.atomWrapper1.position != null) {
                    let rotationAxis: Vector3 = bond.atomWrapper1.position.clone().sub(centralAtom.position).normalize();
                    let rotationAngle: number = Math.acos(rotationAxis.dot(new Vector3(-1, 0, 0)));
                    centralAtom.rotation.setFromAxisAngle(rotationAxis, rotationAngle).normalize();
                }
                else if (bond.atomWrapper2 != null && bond.atomWrapper2 != centralAtom && bond.atomWrapper2.position != null) {
                    let rotationAxis: Vector3 = bond.atomWrapper2.position.clone().sub(centralAtom.position).normalize();
                    let rotationAngle: number = Math.acos(rotationAxis.dot(new Vector3(1, 0, 0)));
                    centralAtom.rotation.setFromAxisAngle(rotationAxis, rotationAngle).normalize();
                }
            }

            if (centralAtom.stericNumber == 0) {
                return centralAtom;   
            }
            else if (centralAtom.stericNumber == 1) { // Linear
                if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                    centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(centralAtom.rotation));
                }
                else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                    centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(centralAtom.rotation));
                }
            }
            switch(centralAtom.lonePairs) {
                case 0:
                    switch(centralAtom.stericNumber) {
                        case 2: 
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 3: 
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 4: 
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[3].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[3].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(109.5)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 5:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[4].atomWrapper1 != null && centralAtom.bonds[4].atomWrapper1 != centralAtom && centralAtom.bonds[4].atomWrapper1.position == null) {
                                centralAtom.bonds[4].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[4].atomWrapper2 != null && centralAtom.bonds[4].atomWrapper2 != centralAtom && centralAtom.bonds[4].atomWrapper2.position == null) {
                                centralAtom.bonds[4].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 6:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[4].atomWrapper1 != null && centralAtom.bonds[4].atomWrapper1 != centralAtom && centralAtom.bonds[4].atomWrapper1.position == null) {
                                centralAtom.bonds[4].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[4].atomWrapper2 != null && centralAtom.bonds[4].atomWrapper2 != centralAtom && centralAtom.bonds[4].atomWrapper2.position == null) {
                                centralAtom.bonds[4].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[5].atomWrapper1 != null && centralAtom.bonds[5].atomWrapper1 != centralAtom && centralAtom.bonds[5].atomWrapper1.position == null) {
                                centralAtom.bonds[5].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[5].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[5].atomWrapper2 != null && centralAtom.bonds[5].atomWrapper2 != centralAtom && centralAtom.bonds[5].atomWrapper2.position == null) {
                                centralAtom.bonds[5].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[5].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                    }
                    break;
                case 1:
                    switch(centralAtom.stericNumber) {
                        case 3: // bond angle 109, 180 - 54.5 = 125.5
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 4: // bond angle 107, need top to bottom to be 110, central across y is still 120 deg
                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[2].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[3].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[3].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(110)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-120)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 5:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-125.5)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 6:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[4].atomWrapper1 != null && centralAtom.bonds[4].atomWrapper1 != centralAtom && centralAtom.bonds[4].atomWrapper1.position == null) {
                                centralAtom.bonds[4].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[4].atomWrapper2 != null && centralAtom.bonds[4].atomWrapper2 != centralAtom && centralAtom.bonds[4].atomWrapper2.position == null) {
                                centralAtom.bonds[4].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[4].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                    }
                    break;
                case 2:
                    switch(centralAtom.stericNumber) {
                        case 4: // water is 104.5, 52.25 half, 127.75 angle
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(127.75)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(127.75)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-127.75)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-127.75)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 5:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 6:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[0].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[1].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-45)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[3].atomWrapper1 != null && centralAtom.bonds[3].atomWrapper1 != centralAtom && centralAtom.bonds[3].atomWrapper1.position == null) {
                                centralAtom.bonds[3].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[3].atomWrapper2 != null && centralAtom.bonds[3].atomWrapper2 != centralAtom && centralAtom.bonds[3].atomWrapper2.position == null) {
                                centralAtom.bonds[3].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[3].length, 0, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), degToRad(-135)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                    }
                    break;
                case 3:
                    switch(centralAtom.stericNumber) {
                        case 5:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            break;
                        case 6:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(-10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), degToRad(10)).normalize()).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[2].atomWrapper1 != null && centralAtom.bonds[2].atomWrapper1 != centralAtom && centralAtom.bonds[2].atomWrapper1.position == null) {
                                centralAtom.bonds[2].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[2].atomWrapper2 != null && centralAtom.bonds[2].atomWrapper2 != centralAtom && centralAtom.bonds[2].atomWrapper2.position == null) {
                                centralAtom.bonds[2].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(centralAtom.bonds[2].length, 0, 0).applyQuaternion(centralAtom.rotation));
                            }
                            break;
                    }
                    break;
                case 3:
                    switch(centralAtom.stericNumber) {
                        case 6:
                            if (centralAtom.bonds[0].atomWrapper1 != null && centralAtom.bonds[0].atomWrapper1 != centralAtom && centralAtom.bonds[0].atomWrapper1.position == null) {
                                centralAtom.bonds[0].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[0].atomWrapper2 != null && centralAtom.bonds[0].atomWrapper2 != centralAtom && centralAtom.bonds[0].atomWrapper2.position == null) {
                                centralAtom.bonds[0].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[0].length, 0).applyQuaternion(centralAtom.rotation));
                            }

                            if (centralAtom.bonds[1].atomWrapper1 != null && centralAtom.bonds[1].atomWrapper1 != centralAtom && centralAtom.bonds[1].atomWrapper1.position == null) {
                                centralAtom.bonds[1].atomWrapper1.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            else if (centralAtom.bonds[1].atomWrapper2 != null && centralAtom.bonds[1].atomWrapper2 != centralAtom && centralAtom.bonds[1].atomWrapper2.position == null) {
                                centralAtom.bonds[1].atomWrapper2.position = centralAtom.position.clone().add(new Vector3(0, centralAtom.bonds[1].length, 0).negate().applyQuaternion(centralAtom.rotation));
                            }
                            break;
                    }
                    break;
            }
        }
        return centralAtom;
    }

    public static findLonePairs(centralAtom: AtomWrapper): number {
        if (centralAtom.atom != null) {
            if (centralAtom.bonds.length == 0 || centralAtom.bonds.length == 1) {
                // No lone pairs or one pair, so we're done here!
                return 0;
            }
            let numBonds: number = 0;
            for (let bond of centralAtom.bonds) {
                numBonds += bond.numBonds;
            }
            return Math.trunc((centralAtom.atom.valenceElectrons - numBonds) / 2);
        }
        return 0;
    }
}