# IGNITION - COMMON ENGINE 1 #

This is the library of HTML5 Pixi.js slot games related classes that contains common structures among game clients written in engine 1.

### Installation ###

This project will not work on its own and is supposed to be used as a submodule in your own project.
This project also depends on **IGNITION - CORE HTML5** and **IGNITION - SLOTS HTML5** libraries, so make sure to initialize them as well.
To use the classes please run this command in your root folder of project repository:

```
git submodule add git+ssh://git@bitbucket.org:ignition/exagaming-common-engine-1.git ./src/gamma-engine/common
```

Install **CORE AND SLOTS** libraries using instructions found in theirs repository README.md files.

Install dependencies
```shell
yarn add pixi.js pixi-spine pisi-stats howler 
```

### Removal ###

If for some reason you want to remove a submodule just run:

```
git rm -r ./src/gamma-engine/common
```

and commit after that.
