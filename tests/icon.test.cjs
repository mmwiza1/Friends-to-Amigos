const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const zlib=require('node:zlib');
const crypto=require('node:crypto');
const base='android/app/src/main/res/';

// Inspect committed PNGs without adding an image/test dependency.
function png(path){
 const bytes=fs.readFileSync(path);assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);assert.equal(bytes[24],8);assert.equal(bytes[25],6);
 const idat=[];for(let pos=8;pos<bytes.length;){const length=bytes.readUInt32BE(pos);if(bytes.toString('ascii',pos+4,pos+8)==='IDAT')idat.push(bytes.subarray(pos+8,pos+8+length));pos+=length+12;}
 const raw=zlib.inflateSync(Buffer.concat(idat)),pixels=Buffer.alloc(width*height*4),stride=width*4;
 function paeth(a,b,c){const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
 for(let y=0;y<height;y++){const type=raw[y*(stride+1)];assert.ok(type<=4);for(let x=0;x<stride;x++){const i=y*stride+x,a=x>=4?pixels[i-4]:0,b=y?pixels[i-stride]:0,c=y&&x>=4?pixels[i-stride-4]:0;const filter=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][type];pixels[i]=(raw[y*(stride+1)+1+x]+filter)&255;}}
 return {width,height,pixels,pixel(x,y){return [...pixels.subarray((y*width+x)*4,(y*width+x)*4+4)];}};
}

test('launcher foreground is a large full-colour happy bull with horns and ears inside the adaptive safe circle',()=>{
 const icon=png(base+'drawable-nodpi/launcher_bull.png');assert.equal(icon.width,432);assert.equal(icon.height,432);
 let minX=432,maxX=0,visible=0,coloured=0;
 for(let y=0;y<432;y++)for(let x=0;x<432;x++){const [r,g,b,a]=icon.pixel(x,y);if(a>=8){assert.ok(Math.hypot(x-216,y-216)<=33*4,'meaningful art outside 66dp safe circle');minX=Math.min(minX,x);maxX=Math.max(maxX,x);visible++;if(Math.max(r,g,b)-Math.min(r,g,b)>40)coloured++;}}
 assert.ok(visible>30000);assert.ok(maxX-minX>=240,'face should occupy most of the visible 72dp mask');assert.ok(coloured>visible*.4,'normal icon must preserve full colour');assert.equal(icon.pixel(0,0)[3],0);
});

test('launcher has local density fallbacks, round masking, adaptive layers and Android 13 monochrome',()=>{
 for(const [density,size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})){
  const square=png(base+`mipmap-${density}/ic_launcher.png`),round=png(base+`mipmap-${density}/ic_launcher_round.png`);
  assert.equal(square.width,size);assert.equal(square.height,size);assert.equal(round.width,size);assert.equal(round.height,size);assert.equal(square.pixel(0,0)[3],255);assert.equal(round.pixel(0,0)[3],0);assert.ok(round.pixel(size>>1,size>>1)[3]>250);
 }
 for(const version of [26,33])for(const name of ['ic_launcher','ic_launcher_round']){
  const xml=fs.readFileSync(base+`mipmap-anydpi-v${version}/${name}.xml`,'utf8');assert.match(xml,/<adaptive-icon/);assert.match(xml,/@drawable\/ic_launcher_foreground/);assert.match(xml,/@drawable\/ic_launcher_background/);if(version===33)assert.match(xml,/<monochrome.*@drawable\/ic_launcher_monochrome/);
 }
 for(const name of ['ic_launcher_foreground','ic_launcher_monochrome'])assert.match(fs.readFileSync(base+`drawable/${name}.xml`,'utf8'),/android:gravity="fill"/);
 const mono=png(base+'drawable-nodpi/launcher_bull_monochrome.png');assert.equal(mono.width,432);for(let y=0;y<432;y++)for(let x=0;x<432;x++)if(mono.pixel(x,y)[3]>=8)assert.ok(Math.hypot(x-216,y-216)<=132);
 const manifest=fs.readFileSync('android/app/src/main/AndroidManifest.xml','utf8');assert.match(manifest,/android:icon="@mipmap\/ic_launcher"/);assert.match(manifest,/android:roundIcon="@mipmap\/ic_launcher_round"/);
});

test('launcher derivatives leave the original lesson mascot unchanged and stay outside WebView course assets',()=>{
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('www/images/lesson-bulls.webp')).digest('hex'),'a6f888db34d0f7332dda8515b09c2e85f1d0b8dd1b210d422272dfd7b74fc749');
 assert.ok(fs.existsSync('android/launcher-artwork/bull-face.png'));assert.ok(fs.existsSync('android/launcher-artwork/launcher-preview.png'));
 const build=fs.readFileSync('android/app/build.gradle','utf8');assert.doesNotMatch(build,/launcher-artwork/);
});
