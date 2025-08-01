'use client';
import Briefing from "@/components/briefing/briefing";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import useScreenSize from "@/hooks/screen-size";
import Success from "@/components/mission-components/success-animation/success";
import { TimeLinePin } from "@/components/pins/pins";
import generateGrid from "./utils/generate-grid";
import Button from "@/components/button/button";
import LoadingPage from "@/components/loading/loading-page";
import Failure from "@/components/mission-components/failed-overlay/failed-overlay";

export default function TimelineTraverse() {
  const GridSize = 9
  const [briefing, setBriefing] = useState(true);
  const [complete, setComplete] = useState(false);
  const [failed, setFailed] = useState(false);
  const [grid, setGrid] = useState(null);
  const [position, setPosition] = useState([0, 2]);
  const [xp, setXp] = useState(100);
  const [shields, setShields] = useState(1);
  const [warps, setWarps] = useState(1);
  const [shieldActive, setShieldActive] = useState(false);
  const [warpActive, setWarpActive] = useState(false);
  const [usingWarp, setUsingWarp] = useState(false);
  const [usingShield, setUsingShield] = useState(false);
  const { mobile } = useScreenSize()

  useEffect(() => {
    if(!mobile) {
      setBriefing(true);
    }
  }, [mobile])

  useEffect(() => {
    setGrid(generateGrid(GridSize));
  }, []);

  useEffect(() => {
    if(xp < 0) {
      setTimeout(() => {
        setFailed(true)
      }, 1400);
    }
  }, [xp]);

  useEffect(() => {
      if(warpActive && noReachablePoints(grid)) {
      setTimeout(() => {
        setFailed(true)
      }, 1400);
    }
  }, [warpActive]);


  const handleBriefingClick = () => {
    setBriefing(!briefing);
  }

  const noReachablePoints = (grid) => {
    if (!grid) return false;
    if (grid[position[0]][position[1]].type === 'final') return false;
    for (let row of grid) {
      for (let node of row) {
        if (node.reachable && !node.visited && node.type !== 'dead') {
          return false;
        }
      }
    }
    return true;
  }

  const resetTimeline = () => {
    setGrid(generateGrid(GridSize));
    setPosition([0, 2]);
    setXp(100);
    setShields(1);
    setWarps(1);
    setShieldActive(false);
    setWarpActive(false);
    setComplete(false);
    setFailed(false);
  }

  const handleMove = (x, y) => {
    const node = grid[x][y];
    if (node.visited || node.type === 'dead') return;

    let xpGain;
    if (shieldActive) {
      xpGain = 0
      setUsingShield(true);
      setShieldActive(false);
    } else {
      xpGain = node.score;
    }
    const newXp = xp + xpGain;
    setXp(newXp);
    switch (node.type) {
      case 'shield':
        setShields(prev => prev + 1);
        break;
      case 'warp':
        setWarps(prev => prev + 1);
        break;
      case 'final':
        if (newXp >= 0) {
          setTimeout(() => {
            setComplete(true)
          }, 1000);
          break
        } else {
          break;
        }
      default:
        break;
    }

    const newGrid = getSurrounding(x, y, false);

    if (wasWarpUsed(position, [x, y])) {
      setUsingWarp(true);
    }

    newGrid[x][y].visited = true;
    newGrid[position[0]][position[1]].from = getMoveDirection(position, [x, y]);
    setGrid(newGrid);

    if(warps === 0 && noReachablePoints(newGrid)) {
      setTimeout(() => {
        setFailed(true)
      }, 1400);
    }

    setTimeout(() => {
      setUsingShield(false);
      setUsingWarp(false);
    }, 1000);

    setWarpActive(false);
    setPosition([x, y]);
  };

  const wasWarpUsed = (prev, current) => {
    if (!prev) return false;
    const [prevX, prevY] = prev;
    const [currentX, currentY] = current;
    return (
      (Math.abs(currentX - prevX) === 2 && currentY === prevY) ||
      (Math.abs(currentY - prevY) === 2 && currentX === prevX)
    );
  };

  const getMoveDirection = (prev, current) => {
    if (!prev) return null;
    const [prevX, prevY] = prev;
    const [currentX, currentY] = current;
  
    if (currentX === prevX && currentY === prevY + 1) return "left";
    if (currentX === prevX && currentY === prevY - 1) return "right";
    if (currentX === prevX + 1 && currentY === prevY) return "up";
    if (currentX === prevX - 1 && currentY === prevY) return "down";
  
    return null;
  };

  const getSurrounding = (x, y, warpActive) => {
    const range = warpActive ? 2 : 1;
    const newGrid = grid.map(row => 
      row.map(node => ({ ...node, reachable: false }))
    );
  
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if ((dx === 0 || dy === 0) && !(dx === 0 && dy === 0)) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < GridSize && ny < 5) {
            newGrid[nx][ny].reachable = true;
          }
        }
      }
    }
  
    return newGrid;
  };

  const activateWarp = () => {
    if (warps > 0) {
      setWarpActive(true);
      setWarps(prev => prev - 1);
      const newGrid = getSurrounding(position[0], position[1], true);
      setGrid(newGrid);
    } else {
      console.log("No warps available");
    }
  }

  const activateShield = () => {
    if (shields > 0) {
      setShieldActive(true);
      setShields(prev => prev - 1);
    }
  }

  if (!grid) return <LoadingPage/>;
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        {usingWarp && <img src='/warp.png' className={`${styles.animation}`}/>}
        {usingShield && <img src='/shield.png' className={`${styles.animation} ${styles.shield}`}/>}
        {complete && <Success page='/experience'></Success>}
        <div className={`briefing-offset`}>
          <Briefing handleClick={handleBriefingClick} briefing={briefing}>
            <h3>Mission: Timeline Alignment</h3>
            <p>AC1178 has hidden their background in a corrupted timeline simulation, We must traverse the simulation to uncover the truth of the agents past.</p>
            <p>You must navigate your way through the simulation to the present destination via a series of interconnected nodes, each representing a key moment in the agent's history.</p>
            <p>Be careful however as each node will have various effects on your experience, if your experience drops below zero you will be ejected from the simulation.</p>
          </Briefing>
              <div className={styles.gameContainer}>
              {failed && <Failure reset={resetTimeline}/>}  
                <div className={styles.controls}>
                  <h3>Current Experience: {xp}</h3>
                  <button disabled={failed || shieldActive} className={styles.actionButton} onClick={() => activateShield()}>🛡️ {`${shields}`}</button>
                  <button disabled={failed || warpActive} className={styles.actionButton} onClick={() => activateWarp()}>🌀 {warps}</button>
                </div>
              <div className={styles.gridContainer} inert={failed}>              {grid.map((row, x) =>
                row.map((node, y) => {
                    const isCurrent = position[0] === x && position[1] === y;
                    const direction = node?.from;
                  return (
                    <div className={`${styles.gridItem}`} key={`${x}-${y}`}>
                      {direction === 'up' && <div className={`${styles.line} ${styles.forward} ${failed && styles.failed}`}></div>}
                      {direction === 'down' && <div className={`${styles.line} ${styles.back} ${failed && styles.failed}`}></div>}
                      {direction === 'left' && <div className={`${styles.line} ${styles.left} ${failed && styles.failed}`}></div>}
                      {direction === 'right' && <div className={`${styles.line} ${styles.right} ${failed && styles.failed}`}></div>}
                      <TimeLinePin
                        handleClick={() => handleMove(x, y)}
                        details={node}
                        reachable={node.reachable}
                        currentXp={xp}
                        isCurrent={isCurrent}
                        failed={failed}
                        shieldActive={shieldActive}
                      >
                      </TimeLinePin>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          </div>
      </section>
    </main>
  );
}
