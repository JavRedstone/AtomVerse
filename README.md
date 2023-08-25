# Goose Hacks 2023 --- AtomVerse
Author: Javier Huang
![The Atomverse Logo --- A real screenshot of a water molecule in the simulation.](https://i.imgur.com/thvYkrP.png)
#### The Atomverse Logo --- A real screenshot of a water molecule in the simulation.

## Inspiration

**AtomVerse is inspired by the world of the tiny**, as the name implies. I built this project through my passion and wonders of Physics and Chemistry.

I really wanted to make this project a reality because of two things. First, the need for **educational simulations to be more hands-on and manipulable by students** as most simulations are pre-animated or pre-recorded. Second, the fact that **macroscopic simulations of materials are insufficient for generalizing across all types of materials**. Having microscopic simulations in AtomVerse that can be expanded into macroscopic simulations attempts to fix this problem.

## What it does

**This project combines the aspects of Physics and Chemistry through 3D simulation**. This can be especially helpful in the **education industry,** as students can visualize and control molecular simulations instead of just watching pre-animated simulations.

One first creates molecules by **selecting the molecule desired in the dropdown and adding it**. As the simulation now is filled with molecules, users can pan around them using their mouse or fingers in order to see the complex interactions between the molecules and atoms. In addition, the user can **adjust the temperature of the simulation using the slider**. They can also **stop and start, pause and play, as well as change the simulation's speeds**.

![Dropdown for selecting molecule, slider for temperature, button to add molecules.](https://i.imgur.com/lfQHDfS.png)
#### Dropdown for selecting molecule, slider for temperature, button to add molecules.

![The controls of the simulation - from left to right: Stop/Start, Pause/Play, Slow Down, Speed Up, Reset Speed.](https://i.imgur.com/YBoEwaW.png)
#### The controls of the simulation - from left to right: Stop/Start, Pause/Play, Slow Down, Speed Up, Reset Speed.

The simulation takes in account **CPK coloring** for the color-coding of the atoms and also predicts **molecular structures using the VSEPR theory**, as well as several intermolecular forces such as London Dispersion Forces, Dipole-Dipole, Ion-Ion, Ion-Dipole, and Hydrogen Bonding.

![The chart of VSEPR theory that I coded into AtomVerse to simulate covalent molecules.](https://ds055uzetaobb.cloudfront.net/image_optimizer/83836f2f6a067d952e16ad5cf796f9d4dc091b2c.png)
#### The chart of VSEPR theory that I coded into AtomVerse to simulate covalent molecules.

The simulation also treats ions separately, by simulating each ion atom separately through electrostatic forces as a result of differences in charge and letting them form crystallized structures.

![Simulating 100 Oxygen molecules at 0 degrees Celsius. Each atom in the molecule is bound by double bonds.](https://i.imgur.com/tZSoOOI.png)
#### Simulating 100 Oxygen molecules at 0 degrees Celsius. Each atom in the molecule is bound by double bonds.

![Simulating 100 Sodium Chloride ionic compounds at 0 degrees Celsius. Each ion is visibly separate.](https://i.imgur.com/JcOXQXP.png)
#### Simulating 100 Sodium Chloride ionic compounds at 0 degrees Celsius. Each ion is visibly separate.

## How I built it

I built this project using the **Angular CLI framework** and **Three.js library** for 3D rendering.

Naturally, I used the Object Oriented Programming (OOP) approach, by first building up classes for the Atoms and Molecules, then manipulated them in the simulation using a math helper class, and finally displayed the atoms and molecules to the user through the UI component.

&rarr; **Atom and Molecule Classes & Wrappers** for creating the atoms and molecules.
&nbsp;&nbsp;&nbsp;&nbsp;&rarr; **Simulation Class** to control the simulation.
&nbsp;&nbsp;&nbsp;&nbsp;&rarr; **MathHelper Class** to perform mathematical operations, such as conversion of units and finding velocity from temperature and mass.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&rarr; **UI Component** to create molecule meshes and display them.

![Code structure](https://i.imgur.com/muCZiK2.png)
#### Code structure of my AtomVerse project using the Angular CLI framework.

## Challenges I ran into

The challenge that I ran into is notably creating the VSEPR structures. Creation of more and more complex molecules required chaining several Quaternions with unique axes and angles together, along with the positions. This was quite difficult since it needed a lot of tuning, but eventually I figured it out.

## Accomplishments that I am proud of

The accomplishments that I am proud of are mainly that I was able to create a simulation that can simulate hundreds of molecules in real-time and that I was able to account for many scenarios, such as different types of forces between nonpolar and polar molecules, as well as different conditions for hydrogen bonding and ion attraction.

## What I learned

I learned a lot throughout this process regarding the Three.js library. Since I have never used Three.js before, I explored it and tried out many of its features such as Bloom effects, Quaternions and Vector3's and more throughout process of making this project.

## What's next for AtomVerse?

The next steps for AtomVerse are to include more forces and molecule types, as well as expanding the simulation to be of **larger-scale and able handle more atoms and molecules**. As the goal of the project is to generalize macroscopic properties from microscopic properties and also to be an intuitive educational tool, further steps will be taken to home those goals.
