"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";

const Card = ({ position }) => {
	const cardRef = useRef();
	const controlsRef = useRef();

	const velocity = useRef(new THREE.Vector3());

	useFrame(() => {
		if (velocity.current.length() > 0) {
			cardRef.current.position.add(velocity.current);
			velocity.current.multiplyScalar(0.95); // Apply some friction
		}
	});

	return (
		<>
			<DragControls ref={controlsRef} args={[cardRef]} />
			<mesh ref={cardRef} position={position}>
				<boxGeometry args={[0.5, 0.5, 0.1]} />
				<meshStandardMaterial color={"red"} />
			</mesh>
		</>
	);
};

export default Card;
