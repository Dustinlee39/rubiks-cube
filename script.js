const container = document.getElementById('cube-container');
const CUBE_SIZE=3, CUBIE_SIZE=90, GAP=2;
let cubeRotationX=-30, cubeRotationY=-30, isDragging=false, startX, startY, rotatingLayer=false;
let cubeState=[];

function createCubie(x,y,z){
  const cubie=document.createElement('div'); cubie.classList.add('cubie');
  cubie.style.transform=`translateX(${x}px) translateY(${y}px) translateZ(${z}px)`;
  ['front','back','right','left','top','bottom'].forEach(faceName=>{
    const face=document.createElement('div'); face.classList.add('face',faceName);
    cubie.appendChild(face);
  });
  return cubie;
}

function generateCube(){
  const offset=((CUBE_SIZE-1)*(CUBIE_SIZE+GAP))/2;
  cubeState=[];
  for(let x=0;x<CUBE_SIZE;x++){ cubeState[x]=[];
    for(let y=0;y<CUBE_SIZE;y++){ cubeState[x][y]=[];
      for(let z=0;z<CUBE_SIZE;z++){
        const cubie=createCubie(x*(CUBIE_SIZE+GAP)-offset, y*(CUBIE_SIZE+GAP)-offset, z*(CUBIE_SIZE+GAP)-offset);
        container.appendChild(cubie); cubeState[x][y][z]=cubie;
      }
    }
  }
  updateCubeRotation();
}

function updateCubeRotation(){ container.style.transform=`rotateX(${cubeRotationX}deg) rotateY(${cubeRotationY}deg)`; }

function rotateLayer(axis,index,direction){
  const cubies=[];
  for(let x=0;x<CUBE_SIZE;x++){for(let y=0;y<CUBE_SIZE;y++){for(let z=0;z<CUBE_SIZE;z++){
    if((axis==='x'&&x===index)||(axis==='y'&&y===index)||(axis==='z'&&z===index)) cubies.push(cubeState[x][y][z]);
  }}}
  cubies.forEach(cubie=>{
    const current=cubie.style.transform; let rotateStr='';
    if(axis==='x') rotateStr=` rotateX(${direction*90}deg)`;
    if(axis==='y') rotateStr=` rotateY(${direction*90}deg)`;
    if(axis==='z') rotateStr=` rotateZ(${direction*90}deg)`;
    cubie.style.transition='transform 0.5s ease-in-out'; cubie.style.transform=current+rotateStr;
  });
  setTimeout(()=>updateCubeState(axis,index,direction),510);
}

function updateCubeState(axis,index,direction){
  const newState=JSON.parse(JSON.stringify(cubeState));
  for(let x=0;x<CUBE_SIZE;x++){for(let y=0;y<CUBE_SIZE;y++){for(let z=0;z<CUBE_SIZE;z++){
    if(axis==='x'&&x===index){ const nx=x, ny=direction===1?2-z:z, nz=direction===1?y:2-y; newState[nx][ny][nz]=cubeState[x][y][z]; }
    if(axis==='y'&&y===index){ const nx=direction===1?2-z:z, ny=y, nz=direction===1?x:2-x; newState[nx][ny][nz]=cubeState[x][y][z]; }
    if(axis==='z'&&z===index){ const nx=direction===1?y:2-y, ny=direction===1?2-x:x, nz=z; newState[nx][ny][nz]=cubeState[x][y][z]; }
  }}}
  cubeState=newState;
}

// Dragging for cube rotation and layer rotation
function startDrag(e){ isDragging=true; startX=e.type.includes('mouse')?e.clientX:e.touches[0].clientX; startY=e.type.includes('mouse')?e.clientY:e.touches[0].clientY; container.style.cursor='grabbing'; }
function drag(e){ 
  if(!isDragging) return; 
  const currentX=e.type.includes('mouse')?e.clientX:e.touches[0].clientX; 
  const currentY=e.type.includes('mouse')?e.clientY:e.touches[0].clientY; 
  const deltaX=currentX-startX; const deltaY=currentY-startY; 

  if(!rotatingLayer){ cubeRotationY+=deltaX*0.5; cubeRotationX-=deltaY*0.5; updateCubeRotation(); }

  startX=currentX; startY=currentY; 
}
function endDrag(){ isDragging=false; rotatingLayer=false; container.style.cursor='grab'; }

container.addEventListener('mousedown',startDrag);
container.addEventListener('mousemove',drag);
container.addEventListener('mouseup',endDrag);
container.addEventListener('mouseleave',endDrag);
container.addEventListener('touchstart',startDrag);
container.addEventListener('touchmove',drag);
container.addEventListener('touchend',endDrag);
container.addEventListener('touchcancel',endDrag);

generateCube();
