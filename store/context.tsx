"use client";

import React, { createContext, useEffect, useState } from "react";

export interface CardInterface {
	name: string;
	isActive: boolean;
	isOnTable: boolean;
	cardFinalPosition: number[];
	cardFinalRotation: number[];
	setCardFinalPosition: (input: number[]) => void;
}

interface CardDrapeInterface {
	cards: CardInterface[];
	setCards: (input: CardInterface[]) => void;
	activeCard: null | CardInterface;
	setActiveCard: (input: CardInterface) => void;
	playedCards: [] | CardInterface[];
	setPlayedCards: (input: CardInterface[]) => void;
}

const dummyCards = [
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

const defaultContext = {
	cards: [],
	setCards: () => {},
	activeCard: null,
	setActiveCard: () => {},
	playedCards: [],
	setPlayedCards: () => {},
};

export const CardDrapeContext =
	createContext<CardDrapeInterface>(defaultContext);

export default function CardDrapeContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [cards, setCards] = useState<CardInterface[]>(dummyCards);
	const [activeCard, setActiveCard] = useState<CardInterface>();
	const [playedCards, setPlayedCards] = useState<CardInterface[]>([]);

	useEffect(() => {
		if (cards.length > 0) {
			if (!activeCard) {
				// dealNewCard
				const newSelectedCard = cards[0];
				newSelectedCard.isActive = true;

				setActiveCard(newSelectedCard);
			}
		}
	}, [activeCard, cards]);

	console.log(activeCard);
	return (
		<CardDrapeContext.Provider
			value={{
				cards,
				setCards,
				activeCard,
				setActiveCard,
				playedCards,
				setPlayedCards,
			}}>
			{children}
		</CardDrapeContext.Provider>
	);
}
