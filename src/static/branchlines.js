// Animated Git-style branch lines background
// Draws animated lines on a canvas covering the page background

function randomColor() {
  // More vibrant and varied colors for branch lines
  const colors = [
    "#bfff00", // lime green
    "#1a237e", // deep blue
    "#00e5ff", // cyan
    "#ff4081", // pink
    "#ffd600", // yellow
    "#00c853", // vivid green
    "#ff1744", // red
    "#6200ea", // purple
    "#00b8d4", // teal
    "#fff",    // white
    "#aee571"  // light green
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawBranches(ctx, width, height, branches) {
  ctx.clearRect(0, 0, width, height);
  branches.forEach(branch => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(branch.x, branch.y);
    for (let i = 0; i < branch.points.length; i++) {
      ctx.lineTo(branch.points[i].x, branch.points[i].y);
    }
    ctx.strokeStyle = branch.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.85;
    ctx.shadowColor = branch.color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  });
}

function animateBranches(canvas, branches) {
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let mouse = { x: -1000, y: -1000 };

  // Flinch effect: points are repelled by the mouse
  canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function animate() {
    branches.forEach(branch => {
      branch.points.forEach(pt => {
        // Flinch away from mouse if close
        const dx = pt.x - mouse.x;
        const dy = pt.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          // Avoid division by zero and ensure direction
          if (dist < 1) dist = 1;
          // If mouse is extremely close, teleport the point far away
          if (dist < 30) {
            // Teleport the point directly away from the mouse, to the nearest edge
            let tx = pt.x, ty = pt.y;
            if (Math.abs(dx) > Math.abs(dy)) {
              // Move to left or right edge
              tx = dx > 0 ? window.innerWidth - 1 : 1;
              ty = pt.y + dy * (window.innerWidth / Math.abs(dx));
              ty = Math.max(1, Math.min(window.innerHeight - 1, ty));
            } else {
              // Move to top or bottom edge
              ty = dy > 0 ? window.innerHeight - 1 : 1;
              tx = pt.x + dx * (window.innerHeight / Math.abs(dy));
              tx = Math.max(1, Math.min(window.innerWidth - 1, tx));
            }
            pt.x = tx;
            pt.y = ty;
            // Set velocity to keep moving away from mouse
            pt.vx = (dx / dist) * 3;
            pt.vy = (dy / dist) * 3;
          } else {
            // 100x more bounce when mouse is near
            const force = (120 - dist) / 120 * 2.5 * 100;
            pt.vx += (dx / dist) * force;
            pt.vy += (dy / dist) * force;
          }
        }
  // Zero gravity: no bounce, let points drift off screen
  pt.x += pt.vx;
  pt.y += pt.vy;
  // Apply a tiny friction to keep things from going too fast
  pt.vx *= 0.995;
  pt.vy *= 0.995;
  // Add a tiny random drift to simulate space
  pt.vx += (Math.random() - 0.5) * 0.01;
  pt.vy += (Math.random() - 0.5) * 0.01;
  // Ensure minimum velocity so points never stop
  const minV = 0.08;
  if (Math.abs(pt.vx) < minV) pt.vx += minV * (Math.random() > 0.5 ? 1 : -1);
  if (Math.abs(pt.vy) < minV) pt.vy += minV * (Math.random() > 0.5 ? 1 : -1);
      });
    });
    drawBranches(ctx, width, height, branches);
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "git-branch-bg";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = 0.7;
  document.body.prepend(canvas);

  // Generate random branches
  const width = window.innerWidth;
  const height = window.innerHeight;
  const branches = [];
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const points = [];
    let px = x, py = y;
    for (let j = 0; j < 6; j++) {
      px += (Math.random() - 0.5) * 120;
      py += (Math.random() - 0.5) * 120;
      points.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7
      });
    }
    branches.push({
      x, y, points, color: randomColor()
    });
  }
  animateBranches(canvas, branches);

  // Resize canvas on window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
