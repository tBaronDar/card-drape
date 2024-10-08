"use client";

import React from "react";
import * as THREE from "three";

export default function PlayedCard({ position, rotation }) {
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
			position={position}
			rotation={rotation}
			material={materials}
			receiveShadow>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
		</mesh>
	);
}
