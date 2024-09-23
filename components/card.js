"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

const startingPosition = [0, 2, 5];
const Card = ({ dealer, activeCard }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [direction, setDirection] = useState([0, 0]);
	const [isImpulseApplied, setIsImpulseApplied] = useState(false);
	const [velocity, setVelocity] = useState([0, 0, 0]);

	// Setup physics for the card using useBox from react-three-cannon
	const [ref, api] = useBox(() => ({
		mass: 0.1, //
		position: startingPosition, // Starting position
		rotation: [0, 0, 0], // Starting rotation
		args: [0.2, 0.38, 0.01], // Dimensions of the box (x, y, z)
		onCollide: (e) => {
			console.log("Collided with", e.body);
		},
	}));

	useEffect(() => {
		const unsubscribeVelocity = api.velocity.subscribe((v) => setVelocity(v));

		return () => unsubscribeVelocity();
	}, [api]);

	// Handle drag with gesture (updating physics position)
	const drag = useDrag(
		({ offset: [x, y], movement: [mx, my], down }) => {
			setIsDragging(down);

			// api.velocity.subscribe((pos) => console.log(pos));
			// api.position.subscribe((pos) => console.log(pos));
			if (down) {
				// Update card position in the physics world during dragging
				api.position.set(x / 500, 2 + -y / 500, 5);

				setDirection([mx, my]);
				api.velocity.set(0, 0, 0);
			}
		},
		{ pointer: { touch: true }, preventScroll: true }
	);

	// Use frame loop to apply rotation and motion when not dragging
	useFrame(() => {
		const isMoving = direction[0] !== 0 || direction[1] !== 0;

		// console.log(direction);
		if (!isDragging && isMoving && !isImpulseApplied) {
			setIsImpulseApplied(true);
			console.log([direction[0] / 100, direction[1] / 120]);
			api.applyImpulse(
				[direction[0] / 150, -direction[1] / 1000, direction[1] / 150],
				[0, 0, 0]
			);
			// console.log((direction[1] * 2) / 100);
		}

		if (isImpulseApplied) {
			api.rotation.set(-Math.PI / 2, 0, 0);
			api.applyTorque([0, -direction[1] / 100, 0]);
		}

		if (!isImpulseApplied && !isMoving && !isDragging) {
			api.position.set(0, 2, 5);
			api.rotation.set(-Math.PI / 6, 0, 0);
			api.velocity.set(0, 0, 0); //no velocity while hovering
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
		<mesh ref={ref} {...drag()} castShadow receiveShadow material={materials}>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
		</mesh>
	);
};

export default Card;
