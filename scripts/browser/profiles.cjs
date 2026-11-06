'use strict';
// Existing CSS viewport/inset/IME matrix; no physical-device claim.
module.exports=[
  {name:'narrow-light-buttons',width:320,height:740,dark:false,bottom:48},
  {name:'small-dark-gesture',width:360,height:800,dark:true,bottom:24},
  {name:'s24-light-buttons',width:384,height:824,dark:false,bottom:48},
  {name:'s24-dark-buttons',width:384,height:824,dark:true,bottom:48},
  {name:'s24-dark-gesture',width:384,height:824,dark:true,bottom:24},
  {name:'large-light-gesture',width:480,height:920,dark:false,bottom:24},
  {name:'landscape-dark-cutout',width:780,height:384,dark:true,bottom:24,left:32},
  {name:'s24-dark-keyboard-resized',width:384,height:470,dark:true,bottom:48,keyboard:true},
  {name:'narrow-light-keyboard-resized',width:320,height:430,dark:false,bottom:24,keyboard:true},
  {name:'s24-dark-keyboard-overlap',width:384,height:824,dark:true,bottom:48,keyboard:true,overlap:340},
  {name:'s24-dark-large-text',width:384,height:824,dark:true,bottom:48,fontScale:1.25},
  // Named Samsung profiles exercise CSS viewports and actual environment variations, not device resolutions.
  {name:'galaxy-s22-light-three-button',width:360,height:780,dark:false,top:28,bottom:48,right:4},
  {name:'galaxy-s24-dark-gesture-overlay-ime',width:360,height:800,dark:true,top:28,bottom:24,keyboard:true,overlap:310},
  {name:'galaxy-s25-dark-large-text-cutout',width:360,height:800,dark:true,top:36,bottom:24,left:8,right:8,fontScale:1.35},
  {name:'galaxy-s25-light-landscape-cutout',width:760,height:360,dark:false,top:20,bottom:24,left:34,right:16,fontScale:1.2},
  {name:'pixel-class-light-portrait',width:412,height:892,dark:false,top:28,bottom:24},
  {name:'pixel-class-dark-large-text',width:412,height:892,dark:true,top:28,bottom:24,fontScale:1.35}
 ];
