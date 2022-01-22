// todo : implement FPS? https://gist.github.com/elundmark/38d3596a883521cb24f5
// todo : implement frameStats? https://stackoverflow.com/questions/63683024/optimise-javascript-canvas-for-mass-drawing-of-tiny-objects
const timer= (callback)=>{
  let total=0, _started=true;
  const start=(diff)=>{
    total+=diff;
    callback(diff, total);
    if (_started) requestAnimationFrame(start);
  };
  requestAnimationFrame(start)
  return {
    alternate:()=>{_started=!_started;total=0;}
  }
};
// todo : manage removeEventListener
const T='tick';
const registerEvents= (allEvents)=> Object.entries(allEvents).forEach(
  ([k,v])=>{
    if (k!==T) document.addEventListener(k,e=>v(e));
  }
);
export default (canvas, model, modelRelated,autoClearing=true)=>{
  // Add _bounds property (canvas size) to model
  model._bounds=[0,0,canvas.width,canvas.height];
  const ctx=canvas.getContext("2d");
  const mr=modelRelated(model);
  if (!mr[T]) mr[T]=()=>({view:()=>{}});
  registerEvents(mr);
  const t=timer((diff,total)=> {
    if (autoClearing) {
      ctx.clearRect(...model._bounds);
      ctx.beginPath();
    }
    mr[T](diff,total);
    mr.view(ctx);
  });
  return {
    alternate:()=>{t.alternate();}
  }
};
