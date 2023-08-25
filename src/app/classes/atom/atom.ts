export class Atom {
    public atomicNumber: number = 0;
    public symbol: string = '';
    public name: string = '';
    public atomicMass: number = 0; // g / mol
    public valenceElectrons: number = 0;
    public maxValenceOrbital: number = 0;
    public vanDerWaalsRadius: number = 0; // pm
    public covalentRadius: number = 0; // pm
    public electronegativity: number = 0;
    public electronAffinity: number = 0;

    public color: number = 0x000000;

    public constructor(
        atomicNumber: number,
        symbol: string,
        name: string,
        atomicMass: number,
        valenceElectrons: number,
        maxValenceOrbital: number,
        vanderwaalsRadius: number,
        covalentRadius: number,
        electronegativity: number,
        electronAffinity: number,

        color: number
    ) {
        this.atomicNumber = atomicNumber;
        this.symbol = symbol;
        this.name = name;
        this.atomicMass = atomicMass;
        this.valenceElectrons = valenceElectrons;
        this.maxValenceOrbital = maxValenceOrbital;
        this.vanDerWaalsRadius = vanderwaalsRadius;
        this.covalentRadius = covalentRadius;
        this.electronegativity = electronegativity;
        this.electronAffinity = electronAffinity;

        this.color = color;
    }

    // https://sciencenotes.org/molecule-atom-colors-cpk-colors/

    public static readonly HYDROGEN: Atom = new Atom(1, 'H', 'Hydrogen', 1.008, 1, 2, 120, 31, 2.20, 72.8, 0xffffff);
    public static readonly HELIUM: Atom = new Atom(2, 'He', 'Helium', 4.0026, 2, 2, 140, 28, 0, 0, 0xd9ffff);
    
    public static readonly LITHIUM: Atom = new Atom(3, 'Li', 'Lithium', 6.94, 1, 8, 182, 128, 0.98, 59.6, 0xcc80ff);
    public static readonly BERYLLIUM: Atom = new Atom(4, 'Be', 'Beryllium', 9.0122, 2, 8, 153, 96, 1.57, 0, 0xc2ff00);
    public static readonly BORON: Atom = new Atom(5, 'B', 'Boron', 10.81, 3, 8, 192, 84, 2.04, 26.7, 0xffb5b5);
    public static readonly CARBON: Atom = new Atom(6, 'C', 'Carbon', 12.011, 4, 8, 170, 75, 2.55, 153.9, 0x909090);
    public static readonly NITROGEN: Atom = new Atom(7, 'N', 'Nitrogen', 14.007, 5, 8, 155, 71, 3.04, 7, 0x3050f8);
    public static readonly OXYGEN: Atom = new Atom(8, 'O', 'Oxygen', 15.999, 6, 8, 152, 66, 3.44, 141, 0xff0d0d);
    public static readonly FLUORINE: Atom = new Atom(9, 'F', 'Fluorine', 18.9984, 7, 8, 147, 57, 3.98, 328, 0x90e050);
    public static readonly NEON: Atom = new Atom(10, 'Ne', 'Neon', 20.1797, 7, 8, 154, 58, 0, 0, 0xb3e3f5);

    public static readonly SODIUM: Atom = new Atom(11, 'Na', 'Sodium', 22.9897, 1, 8, 227, 166, 0.93, 52.8, 0xab5cf2);
    public static readonly MAGNESIUM: Atom = new Atom(12, 'Mg', 'Magnesium', 24.305, 2, 8, 173, 141, 1.31, 0, 0x8aff00);
    public static readonly ALUMINUM: Atom = new Atom(13, 'Al', 'Aluminum', 26.9815, 3, 8, 184, 121, 1.61, 42.5, 0xbfa6a6);
    public static readonly SILICON: Atom = new Atom(14, 'Si', 'Silicon', 28.085, 4, 8, 210, 111, 1.90, 133.6, 0xf0c8a0);
    public static readonly PHOSPHORUS: Atom = new Atom(15, 'P', 'Phosphorus', 30.9738, 5, 8, 180, 107, 2.19, 72, 0xff8000);
    public static readonly SULFUR: Atom = new Atom(16, 'S', 'Sulfur', 32.06, 6, 8, 180, 105, 2.58, 200, 0xffff30);
    public static readonly CHLORINE: Atom = new Atom(17, 'Cl', 'Chlorine', 35.45, 7, 8, 175, 102, 3.16, 349, 0x1ff01f);
    public static readonly ARGON: Atom = new Atom(18, 'Ar', 'Argon', 39.948, 8, 8, 188, 106, 0, 0, 0x80d1e3);

    public static readonly POTASSIUM: Atom = new Atom(19, 'K', 'Potassium', 39.0983, 1, 8, 275, 203, 0.82, 48.4, 0x8f40d4);
    public static readonly CALCIUM: Atom = new Atom(20, 'Ca', 'Calcium', 40.078, 2, 8, 231, 176, 1.0, 2.37, 0x3dff00);
}