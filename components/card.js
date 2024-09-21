"use client";

import React, { useEffect, useRef, useState } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";

const Card = ({ dealer, activeCard }) => {
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(true);
	const [isImpulseApplied, setIsImpulseApplied] = useState(false);
	const [velocity, setVelocity] = useState([0, 0, 0]);

	// Setup physics for the card using useBox from react-three-cannon
	const [ref, api] = useBox(() => ({
		mass: 0.001, // Mass of the card for physics
		position: [0, 2, 5], // Starting position
		rotation: [0, 0, 0], // Starting rotation
		args: [0.2, 0.38, 0.01], // Dimensions of the box (x, y, z)
		onCollide: (e) => {
			console.log("Collided with", e.body);
		},
	}));

	useEffect(() => {
		const unsubscribe = api.velocity.subscribe((v) => setVelocity(v));
		return () => unsubscribe(); // Clean up the subscription
	}, [api]);

	// Handle drag with gesture (updating physics position)
	const drag = useDrag(
		({ offset: [x, y], movement: [mx, my], down }) => {
			setIsDragging(down);

			api.velocity.subscribe((pos) => console.log(pos));
			if (down) {
				setIsHovering(false);
				// Update card position in the physics world during dragging
				api.position.set(x / 200, 2 + -y / 200, 5);
				api.velocity.set(mx, 0, my);
			}
		},
		{ pointer: { touch: true }, preventScroll: true }
	);

	// Use frame loop to apply rotation and motion when not dragging
	useFrame(() => {
		const [vx, vy, vz] = velocity;
		const isMoving = Math.abs(vx) > 0 || Math.abs(vy) > 0 || Math.abs(vz) > 0;

		if (isHovering && !isDragging) {
			// Keep the card hovering at a fixed position
			api.position.set(0, 2, 5);
			api.velocity.set(0, 0, 0); // Ensure no velocity while hovering
		}

		if (!isDragging && !isHovering) {
			api.applyImpulse([0, 0, 10], [0, 0, 0]);
			setIsImpulseApplied(true);
		}
	});

	return (
		<mesh ref={ref} {...drag()} castShadow receiveShadow>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
			<meshStandardMaterial color={"black"} />
		</mesh>
	);
};

export default Card;
