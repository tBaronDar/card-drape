"use client";
import { Canvas } from "@react-three/fiber";
import React from "react";

function Table() {
	return (
		<Canvas>
			<directionalLight position={[0, 0, 3]} />
			<mesh position={[0, 1, 0]} rotation={[Math.PI / -4, 0, 0]}>
				<boxGeometry args={[4, 6, 1]} />
				<meshBasicMaterial color={"green"} />
			</mesh>
		</Canvas>
	);
}

export default Table;
