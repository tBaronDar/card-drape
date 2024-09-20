"use client";

import React from "react";

export default function PlayedCard({ position, rotation, texture }) {
	return (
		<mesh position={position} rotation={rotation}>
			<boxGeometry args={[0.2, 0.38, 0.01]} />
			<meshStandardMaterial map={texture} />
		</mesh>
	);
}
