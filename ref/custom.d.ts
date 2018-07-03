type RosterPlan = {
    room: string;
    roster: CreepDescription[];
}

type CreepDescription = {
    role: string;
    targetPop: number;
    memory?: any;
}

type BodyPlan = {
    energy: number;
    body: string[];
}
