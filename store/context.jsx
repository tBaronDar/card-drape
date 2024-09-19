"use client";

import React, { createContext, useEffect, useState, useMemo } from "react";

export const dummyCards = [
	{
		name: "tenDiamonds",
		isActive: true,
		isOnTable: false,
		cardFinalPosition: [0, 2, 5],
		cardFinalRotation: [0, 0, 0],
		setCardFinalPosition: () => {},
	},
	{
		name: "twoHearts",
		isActive: false,
		isOnTable: false,
		cardFinalPosition: [0, 2, 5],
		cardFinalRotation: [0, 0, 0],
		setCardFinalPosition: () => {},
	},
	{
		name: "oneSpades",
		isActive: false,
		isOnTable: false,
		cardFinalPosition: [0, 2, 5],
		cardFinalRotation: [0, 0, 0],
		setCardFinalPosition: () => {},
	},
];

export default function CardDrapeContextProvider({ children }) {
	// console.log(activeCard);
	return;
}
