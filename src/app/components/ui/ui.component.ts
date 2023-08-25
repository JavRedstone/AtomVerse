import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MoleculeWrapper } from 'src/app/classes/molecule-wrapper/molecule-wrapper';
import { Molecule } from 'src/app/classes/molecule/molecule';
import { Sim } from 'src/app/classes/sim/sim';
import { MathUtils } from '../../classes/math-utils/math-utils';

import * as THREE from 'three';
import CameraControls from 'camera-controls';
CameraControls.install( { THREE: THREE } );

import { Scene, Clock, Color, Vector2, PerspectiveCamera, WebGLRenderer, LinearToneMapping, Mesh, IcosahedronGeometry, MeshPhysicalMaterial, CylinderGeometry, Vector3 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { BondWrapper } from 'src/app/classes/bond-wrapper/bond-wrapper';
import { AtomWrapperWrapper } from 'src/app/classes/atom-wrapper-wrapper/atom-wrapper-wrapper';


@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements AfterViewInit {
  public static readonly ATOM_SCALE = 0.025;

  @ViewChild('uiCanvas') public canvasRef: ElementRef | null = null;
  @ViewChild('uiTemperatureSlider') public temperatureSliderRef: ElementRef | null = null;
  
  public sim: Sim | null = null;

  public scene: Scene | null = null;
  public clock: Clock | null = null;
  public delta: number | null = null;
  public renderer: WebGLRenderer | null = null;
  public composer: EffectComposer | null = null;
  public camera: PerspectiveCamera | null = null;
  public cameraControls: CameraControls | null = null;

  public mesh: Mesh | null = null;

  public molecules: Molecule[] = [
    Molecule.HELIUM,
    Molecule.OXYGEN,
    Molecule.HYDROGEN,
    Molecule.WATER,
    Molecule.CARBON_MONOXIDE,
    Molecule.CARBON_DIOXIDE,
    Molecule.METHANE,
    Molecule.ETHANOL,
    Molecule.SODIUM_CHLORIDE,
    Molecule.POTASSIUM_CHLORIDE,
    Molecule.CALCIUM_FLUORIDE,
    Molecule.BERYLLIUM_OXIDE,
    Molecule.MAGNESIUM_OXIDE
  ];
  public selectedMolecule: Molecule = Molecule.WATER;

  public temperature: number = 0;
  public minTemperature: number = -273;
  public maxTemperature: number = 10000;
  public temperatureStep: number = 1;

  constructor() {
    this.sim = new Sim();
    this.sim.start().temperature = MathUtils.ctoK(this.temperature);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(35, this.calculateAspectRatio(), 1, 500)
    this.clock = new Clock();
  }

  ngAfterViewInit() {
    this.configRenderer();
    this.configCamera();
    this.configCameraControls();
    this.configScene();

    this.tick();
  }

  public onTemperatureChange(): void {
    if (this.sim != null && this.temperatureSliderRef != null) {
      this.sim.temperature = MathUtils.ctoK(Number.parseInt(this.temperatureSliderRef.nativeElement.value));
    }
  }

  public calculateAspectRatio(): number {
    if (this.canvas != null) {
      const height = this.canvas.clientHeight;
      if (height === 0) {
        return 0;
      }
      return this.canvas.clientWidth / this.canvas.clientHeight;
    }
    return 0;
  }

  public get canvas(): HTMLCanvasElement | null {
    if (this.canvasRef != null) {
      return this.canvasRef.nativeElement;
    }
    return null;
  }

  public configScene(): void{
    if (this.scene != null && this.camera != null && this.renderer != null) {
      this.scene.background = new Color(0x000000);

      let renderScene = new RenderPass(this.scene, this.camera);
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      let bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
      this.composer.addPass(bloomPass);
      
      bloomPass.strength = 0.5;
      bloomPass.radius = 1;
      bloomPass.threshold = 0;

      this.renderer.toneMapping = LinearToneMapping;
      this.renderer.toneMappingExposure = 1.5;
    }
  }

  public configCamera(): void {
    if (this.camera != null && this.canvas != null && this.scene != null) {
      this.camera.aspect = this.calculateAspectRatio();
      this.camera.updateProjectionMatrix();
      this.camera.position.set(-15, 10, 15);
      this.camera.lookAt(this.scene.position);
    }
  }

  public configCameraControls(): void {
    if (this.camera != null && this.renderer != null) {
      this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
    }
  }

  public configRenderer(): void {
    if (this.canvas != null) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
  }

  public tick(): void {
    if (this.scene != null && this.sim != null && this.renderer != null && this.clock != null && this.composer != null && this.cameraControls != null) {
      this.delta = this.clock.getDelta();
      this.cameraControls.update(this.delta);
      
      setTimeout(
        () => {
          window.requestAnimationFrame(() => this.tick());
        }, 1000 / 60
      );  

      this.sim.tick();
      
      if (!this.sim.isStarted && this.sim.moleculeWrappers.length > 0) {
        this.deleteEverything();
        this.sim.moleculeWrappers = [];
      }
      
      this.renderAtoms();

      this.composer.render();
    }
  }

  public deleteEverything(): void {
    if (this.scene != null && this.sim != null && this.renderer != null) {
      for (let moleculeWrapper of this.sim.moleculeWrappers) {
        for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
          if (atomWrapperWrapper.mesh != null) {
            this.removeMesh(atomWrapperWrapper.mesh);
          }
        }
        for (let bondWrapper of moleculeWrapper.bondWrappers) {
          if (bondWrapper.meshes != null) {
            for (let mesh of bondWrapper.meshes) {
              this.removeMesh(mesh);
            }
          }
        }
      }
  
      this.renderer.renderLists.dispose();
    }
  }

  public removeMesh(mesh: Mesh): void {
    if (this.scene != null) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        for (let material of mesh.material) {
          material.dispose();
        }
      }
      else {
        mesh.material.dispose();
      }
    }
  }

  public renderAtoms(): void {
    if (this.sim != null && this.scene != null) {
      for (let moleculeWrapper of this.sim.moleculeWrappers) {
        if (moleculeWrapper.molecule != null) {
          if (moleculeWrapper.molecule.type == Molecule.COVALENT) {
            for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
              if (atomWrapperWrapper.mesh != null && atomWrapperWrapper.atomWrapper != null && atomWrapperWrapper.atomWrapper.position != null && moleculeWrapper.position != null) {
                atomWrapperWrapper.mesh.position.set(atomWrapperWrapper.atomWrapper.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).x * UiComponent.ATOM_SCALE, atomWrapperWrapper.atomWrapper.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).y * UiComponent.ATOM_SCALE, atomWrapperWrapper.atomWrapper.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).z * UiComponent.ATOM_SCALE);
              }
            }
          }
          else if (moleculeWrapper.molecule.type == Molecule.IONIC) {
            for (let atomWrapperWrapper of moleculeWrapper.atomWrapperWrappers) {
              if (atomWrapperWrapper.mesh != null) {
                atomWrapperWrapper.mesh.position.set(atomWrapperWrapper.position.x * UiComponent.ATOM_SCALE, atomWrapperWrapper.position.y * UiComponent.ATOM_SCALE, atomWrapperWrapper.position.z * UiComponent.ATOM_SCALE);
              }
            }
          }
        }

        for (let bondWrapper of moleculeWrapper.bondWrappers) {
          if (bondWrapper.bond != null && bondWrapper.bond.atomWrapper1 != null && bondWrapper.bond.atomWrapper2 != null && bondWrapper.bond.atomWrapper1.position != null && bondWrapper.bond.atomWrapper2.position != null) {
            for (let i = 0; i < bondWrapper.bond.numBonds; i++) {
              bondWrapper.meshes[i].position.set(
                (bondWrapper.bond.atomWrapper1.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).x + bondWrapper.bond.atomWrapper2.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).x) * UiComponent.ATOM_SCALE / 2,
                (bondWrapper.bond.atomWrapper1.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).y + bondWrapper.bond.atomWrapper2.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).y) * UiComponent.ATOM_SCALE / 2,
                (bondWrapper.bond.atomWrapper1.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).z + bondWrapper.bond.atomWrapper2.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).z) * UiComponent.ATOM_SCALE / 2);
              bondWrapper.meshes[i].lookAt(bondWrapper.bond.atomWrapper2.position.clone().applyQuaternion(moleculeWrapper.rotation).add(moleculeWrapper.position).multiplyScalar(UiComponent.ATOM_SCALE));
              bondWrapper.meshes[i].rotateX(Math.PI / 2);

              switch(bondWrapper.bond.numBonds) {
                case 1:
                  bondWrapper.meshes[i].translateX(0);
                  break;
                case 2:
                  switch(i) {
                    case 0:
                      bondWrapper.meshes[i].translateX(0.5);
                      break;  
                    case 1:
                      bondWrapper.meshes[i].translateX(-0.5);
                      break;
                  }
                  break;
                case 3:
                  switch(i) {
                    case 0:
                      bondWrapper.meshes[i].translateX(0);
                      break;
                    case 1:
                      bondWrapper.meshes[i].translateX(0.5);
                      break;
                    case 2:
                      bondWrapper.meshes[i].translateX(-0.5);
                      break;
                  }
                  break;
              }
            }
          }
        }
      }
    }
  }

  public addNewMolecule(num: number): void {
    if (this.sim != null && this.scene != null) {
      for (let i = 0; i < num; i++) {
        if (this.selectedMolecule.type == Molecule.COVALENT) {
          let moleculeWrapper: MoleculeWrapper = new MoleculeWrapper(this.selectedMolecule, this.sim.getRandomPosition(), this.sim.getRandomVelocity(this.selectedMolecule.mass), MathUtils.getRandomQuaternion());
          // let moleculeWrapper: MoleculeWrapper = new MoleculeWrapper(this.selectedMolecule, this.sim.getRandomPosition(), new Vector3(0, 0, 0), MathUtils.getRandomQuaternion());
          
          this.sim.moleculeWrappers.push(moleculeWrapper);
  
          if (moleculeWrapper.molecule != null) {
            for (let atomWrapper of moleculeWrapper.molecule.atomWrappers) {
              if (atomWrapper.atom != null && atomWrapper.position != null && moleculeWrapper.position != null) {
                let geometry = new IcosahedronGeometry(atomWrapper.atom.covalentRadius * UiComponent.ATOM_SCALE, 0);
                let material = new MeshPhysicalMaterial({ wireframe: false, emissive: atomWrapper.atom.color, emissiveIntensity: 1 });
                let mesh = new Mesh(geometry, material);
                moleculeWrapper.atomWrapperWrappers.push(new AtomWrapperWrapper(atomWrapper, mesh));
                this.scene.add(mesh);            
              }
            }
      
            // create the bonds for the molecule, loop through molecule.bonds
            for (let bond of moleculeWrapper.molecule.bonds) {
              if (bond != null && bond.atomWrapper1 != null && bond.atomWrapper2 != null) {
                let meshes: Mesh[] = [];
                for (let i = 0; i < bond.numBonds; i++) {
                  let geometry = new CylinderGeometry(0.15, 0.15, bond.length * UiComponent.ATOM_SCALE, 3);
                  let material = new MeshPhysicalMaterial({ wireframe: false, emissive: 0x696969, emissiveIntensity: 0.5 });
                  let mesh = new Mesh(geometry, material);
                  meshes.push(mesh);
                  this.scene.add(mesh);
                }
                moleculeWrapper.bondWrappers.push(new BondWrapper(bond, meshes));
              }
            }
  
          }
        }
        else if (this.selectedMolecule.type == Molecule.IONIC) {
          let moleculeWrapper: MoleculeWrapper = new MoleculeWrapper(this.selectedMolecule, this.sim.getRandomPosition(), this.sim.getRandomVelocity(this.selectedMolecule.mass), MathUtils.getRandomQuaternion());
          this.sim.moleculeWrappers.push(moleculeWrapper);
  
          if (moleculeWrapper.molecule != null) {
            for (let atomWrapper of moleculeWrapper.molecule.atomWrappers) {
              if (atomWrapper.atom != null) {
                let geometry = new IcosahedronGeometry(atomWrapper.atom.vanDerWaalsRadius * UiComponent.ATOM_SCALE, 0);
                let material = new MeshPhysicalMaterial({ wireframe: false, emissive: atomWrapper.atom.color, emissiveIntensity: 1 });
                let mesh = new Mesh(geometry, material);
                let randPos: Vector3 = this.sim.getRandomPosition();
                mesh.position.set(randPos.x, randPos.y, randPos.z);
                let atomWrapperWrapper: AtomWrapperWrapper = new AtomWrapperWrapper(atomWrapper, mesh);
                atomWrapperWrapper.position = this.sim.getRandomPosition();
                atomWrapperWrapper.velocity = this.sim.getRandomVelocity(atomWrapper.atom.atomicMass);
                moleculeWrapper.atomWrapperWrappers.push(atomWrapperWrapper);
                this.scene.add(mesh);
              }
            }
          }
        }
      }
    }
  }

  public startStopSim(): void {
    if (this.sim != null) {
      this.sim.isStarted ? this.sim.stop() : this.sim.start();
      this.temperature = MathUtils.kToC(this.sim.temperature);
    }
  }

  public resumePauseSim(): void {
    if (this.sim != null) {
      this.sim.isPaused ? this.sim.resume() : this.sim.pause();
    }
  }

  public slowDownSim(): void {
    if (this.sim != null) {
      this.sim.slowDown();
    }
  }

  public speedUpSim(): void {
    if (this.sim != null) {
      this.sim.speedUp();
    }
  }

  public resetSpeedSim(): void {
    if (this.sim != null) {
      this.sim.resetSpeed();
    }
  }
}
