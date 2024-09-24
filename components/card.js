"use client";

import React, { useEffect, useState } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const startingPosition = [0, 2, 5];
const Card = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState([0, 0]);
  const [dragCurrent, setDragCurrent] = useState([0, 0]);
  const [isImpulseApplied, setIsImpulseApplied] = useState(false);
  const [isOnTable, setIsOnTable] = useState(false);

  // Setup physics for the card using useBox from react-three-cannon
  const [ref, api] = useBox(() => ({
    mass: 0.1,
    position: startingPosition,
    rotation: [0, 0, 0],
    args: [0.2, 0.38, 0.01],
    onCollide: (e) => {
      console.log("collision");
      setIsOnTable(true);
    },
  }));

  // Handle drag start (pointer down)
  const handlePointerDown = (event) => {
    setIsDragging(true);
    setIsImpulseApplied(false);
    // Store the starting drag position
    setDragStart([event.clientX, event.clientY]);
  };

  // Handle dragging (pointer move)
  const handlePointerMove = (event) => {
    if (!isDragging) return;
    // Update the current drag position
    const newDragCurrent = [event.clientX, event.clientY];
    setDragCurrent(newDragCurrent);

    // Calculate the new X-Y Z constant
    const deltaX = (dragCurrent[0] - dragStart[0]) / window.innerWidth;
    const deltaY = -(dragCurrent[1] - dragStart[1]) / window.innerHeight;

    api.position.set(deltaX * 6, 2 + deltaY * 6, startingPosition[2]); // Adjust scale as needed
  };

  // Handle drag release (pointer up)
  const handlePointerUp = (event) => {
    setIsDragging(false);

    // Calculate impulse based on the Y-axis drag velocity
    const dragVelocityX = (dragCurrent[0] - dragStart[0]) / window.innerWidth;
    const dragVelocityY = (dragCurrent[1] - dragStart[1]) / window.innerHeight;
    api.mass.set(1);
    const impulseStrength = [dragVelocityX * 100, dragVelocityY * 100]; // Adjust this factor as needed for flick strength

    // Apply impulse to the card in the Z direction (simulating a flick)
    api.applyImpulse([impulseStrength[0], 0, impulseStrength[1]], [0, 0, 0]);
    api.rotation.set(-Math.PI / 2, 0, 0);
    setIsImpulseApplied(true);
  };

  // Frame update for any additional effects (like resetting)
  useFrame(() => {
    if (isImpulseApplied) {
      // Optionally reset after flicking

      api.applyTorque([0, -1, 0]);
    }

    if (!isDragging && !isImpulseApplied) {
      api.position.set(0, 2, 5);
      api.velocity.set(0, 0, 0);
    }

    if (isOnTable) {
    }
  });

  const materials = [
    new THREE.MeshStandardMaterial({ color: "grey" }),
    new THREE.MeshStandardMaterial({ color: "grey" }),
    new THREE.MeshStandardMaterial({ color: "grey" }),
    new THREE.MeshStandardMaterial({ color: "grey" }),
    new THREE.MeshStandardMaterial({ color: "red" }),
    new THREE.MeshStandardMaterial({ color: "black" }),
  ];

  return (
    <mesh
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      castShadow
      receiveShadow
      material={materials}
    >
      <boxGeometry args={[0.2, 0.38, 0.01]} />
    </mesh>
  );
};

export default Card;
