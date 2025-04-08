export interface IListCards {
    whomWorkout: Array<ICard>;
    diet: Array<ICard>;
    whomFood: Array<ICard>;
    calories: Array<ICard>;
    whomCalories: Array<ICard>;
}

export interface ICard {
    pathIcon: string;
    text: string;
    size: 'half' | 'full';
    bgColor?: string;
}
