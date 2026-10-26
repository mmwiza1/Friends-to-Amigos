'use strict';
const zlib=require('node:zlib');
function crc(b){let n=0xffffffff;for(const x of b){n^=x;for(let j=0;j<8;j++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;}
function inspect(b){
 if(b.length<1000||b.length>8*1024*1024||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Empty, tiny or invalid PNG');
 let offset=8,width,height,channels,end=false;const data=[];
 while(offset<b.length){if(offset+12>b.length)throw Error('Truncated PNG');const n=b.readUInt32BE(offset),type=b.toString('ascii',offset+4,offset+8);if(n>8*1024*1024||offset+n+12>b.length)throw Error('Truncated PNG chunk');const payload=b.subarray(offset+8,offset+8+n);if(crc(b.subarray(offset+4,offset+8+n))!==b.readUInt32BE(offset+8+n))throw Error('PNG checksum mismatch');
 if(type==='IHDR'){if(width||n!==13)throw Error('Invalid PNG header');width=payload.readUInt32BE(0);height=payload.readUInt32BE(4);channels=payload[9]===2?3:payload[9]===6?4:0;if(width<320||width>500||height<480||height>1600||payload[8]!==8||!channels||payload[10]||payload[11]||payload[12])throw Error('Implausible showcase PNG dimensions/format');}
 if(type==='IDAT')data.push(payload);if(type==='IEND'){end=true;break;}offset+=n+12;}
 if(!width||!end||!data.length)throw Error('Incomplete PNG');const raw=zlib.inflateSync(Buffer.concat(data),{maxOutputLength:8*1024*1024}),stride=width*channels;if(raw.length!==(stride+1)*height)throw Error('Invalid PNG pixel data');
 let previous=Buffer.alloc(stride),colors=new Set();const paeth=(a,b,c)=>{const p=a+b-c,x=Math.abs(p-a),y=Math.abs(p-b),z=Math.abs(p-c);return x<=y&&x<=z?a:y<=z?b:c;};
 for(let y=0;y<height&&colors.size<64;y++){const row=Buffer.alloc(stride),at=y*(stride+1),filter=raw[at];if(filter>4)throw Error('Invalid PNG filter');for(let x=0;x<stride;x++){const a=x>=channels?row[x-channels]:0,v=previous[x],c=x>=channels?previous[x-channels]:0;row[x]=(raw[at+1+x]+(filter===0?0:filter===1?a:filter===2?v:filter===3?Math.floor((a+v)/2):paeth(a,v,c)))&255;}for(let x=0;x<stride;x+=channels)colors.add(row[x]*65536+row[x+1]*256+row[x+2]);previous=row;}
 if(colors.size<32)throw Error('Screenshot appears blank or contains too little visual content');return {width,height};
}
module.exports={inspect,crc};
