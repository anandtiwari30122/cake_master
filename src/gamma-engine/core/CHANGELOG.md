### 1.11.0
[ADDED]
- basic Translations utility class
- support for text translation key from layout setup

### 1.10.0
[ADDED]
- autoscaleText utility function in TextUtils
- measureFontSize utility function in TextUtils
- GradientEffect extended to allow different orientation and stop points.

[UPDATED]
- TextUtils refactored
- applied eslint/prettier rules to multiple files

### 1.9.2
[ADDED]
- AssetsConfigLoader - sound loading duplicate detection

### 1.9.1
[UPDATED]
- AssetsConfigLoader - bundle typing

### 1.9.0
[ADDED]
- SoundManager - operates on SoundData now
- SoundChannel is an EventEmitter now
- Applications, Screens and LayoutBuilder now supports layouts/orientations
- utils.arrayUnique - leave only unique items in array
- new GradientEffect
- MobileBrowserLog

[FIXED]
- Button hitObject bounds fixed
- FrontController addCommand fix

### 1.8.6
[UPDATED]
- ModelLocator and ServiceLocator concept dropped in favor of tsyringe IOC container

### 1.8.5
[UPDATED]
- GlobalMixins.d.ts better fix
- ControlCommand parameters (work in progress)
- LayoutElementFactory text color fix
- Button now using Pixi 7 parameters for interactivity

### 1.8.4
[ADDED]
- GlobalMixins.d.ts that overrides event system autocompletion to allow custom DisplayObject events
- ApplicationEvent enum
- BrowserApplication helper class (in progress)
- Utils randomInt, randomArrayElement

[UPDATED]
- ModelLocator switched to eventemitter3 instance
- some directories naming structure unified

[FIXED]
- statsPanel helper new version fix

### 1.8.3
[ADDED]
- autoUpdateSizeToOrientation application parameter

### 1.8.2
[UPDATED]
- Small linter fixes

### 1.8.1
[UPDATED]
- Screen implementation to avoid recurring code
[ADDED]
- Layouts and orientation events and basic calculation based on screen size and declared available layouts

### 1.8.0
[UPDATED]
- New application and screen base classes with more scaling methods for multiple scenarios
- Adds multiscreen support to the application and should scale correctly 

### 1.7.0 
[ADDED]
- LayoutElement - hitArea polygon support

### 1.6.0
[UPDATED]
- GraphicUtils - interactive param updated to pixi7 eventMode   
[ADDED]
- Quad & LayoutElement - alpha support
- ValueText - reset function

### 1.5.5
[FIXED]
- AssetsConfigLoader - pixi-legacy renderer fix 

### 1.5.4
[FIXED]
- Button - properly updates button view

### 1.5.3
[ADDED]
- eslint turned off 'no-case-declarations'

[FIXED]
- AssetsConfigLoader - XML loading reinstated 

### 1.5.2
[UPDATE]
- AssetsConfigLoader - replacement of "?" operator to support earlier Chromium versions

### 1.5.1
[ADDED]
- StrokeEffect - works with Text

[UPDATE]
- DropShadowEffect added proper padding
- AssetsConfigLoader added preload to spine textures


### 1.5.0
[ADDED]
- effects interface to read from Starling TweenData and render accordingly
- DropShadowEffect - works with Text
- ApplicationScreen default resize method + auto register to resize window event

[UPDATE]
- Utils class replaced with Utils module with functions (it was all static functions anyway)


### 1.4.1
[ADDED]
- expose version string
- generic ApplicationScreen class with various resize options support

[REMOVED]
- not working VideoSprite support, please consider making it work if you need it

### 1.4.0
[UPDATE]
- removed export as node module and moved back to having the core applied as submodule as it was creating too many problems and the development was hard
