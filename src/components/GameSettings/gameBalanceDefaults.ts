export interface EnemyArchetype {
    id: string;
    healthMultiplier: number;
    walkSpeedMultiplier: number;
    meleeMinDamage: number;
    meleeMaxDamage: number;
}

export interface GameBalance {
    schemaVersion: number;
    environmentId: string;
    player: {
        walkSpeed: number;
        runSpeed: number;
        initialHealth: number;
        maximumHealth: number;
    };
    primaryWeapon: {
        magazineSize: number;
        reloadTime: number;
        timeBetweenUses: number;
        autoReload: boolean;
        magazineBased: boolean;
        ammoConsumedPerShot: number;
        projectileMinDamage: number;
        projectileMaxDamage: number;
    };
    mathReload: {
        maxMultiplier: number;
        minMultiplier: number;
        correctAnswerReloadTime: number;
        wrongAnswerReloadTime: number;
        normalTimeScale: number;
        mathQuizTimeLimit: number;
        sliderFollowSpeed: number;
    };
    reloadMathTrigger: {
        slowMotionTimeScale: number;
        normalTimeScale: number;
    };
    combatFeel: {
        movementSlowMultiplier: number;
        movementSlowMultiplierFromProjectile: number;
        slowDuration: number;
    };
    spawner: {
        delayBeforeReturnToStart: number;
        navMeshSnapMaxDistance: number;
        spawnGroundRaycastHeight: number;
        spawnGroundRaycastMaxDistance: number;
        loopWaves: boolean;
    };
    waveAnnouncement: {
        slideInDuration: number;
        holdDuration: number;
        fadeOutDuration: number;
        slidePeekOffset: number;
    };
    navFailsafe: {
        checkInterval: number;
        sampleRadius: number;
        minHeightAboveWalkableNav: number;
        rescueCooldown: number;
        raycastStartHeight: number;
        raycastMaxDistance: number;
    };
    enemyGlobal: {
        healthMultiplier: number;
        walkSpeedMultiplier: number;
    };
    enemyArchetypes: EnemyArchetype[];
    enemyMelee: {
        minDamageCaused: number;
        maxDamageCaused: number;
    };
}

export const defaultGameBalance: GameBalance = {
    schemaVersion: 1,
    environmentId: "default",
    player: {
        walkSpeed: 3.0,
        runSpeed: 16.0,
        initialHealth: 100.0,
        maximumHealth: 100.0,
    },
    primaryWeapon: {
        magazineSize: 20,
        reloadTime: 2.0,
        timeBetweenUses: 0.4,
        autoReload: false,
        magazineBased: true,
        ammoConsumedPerShot: 1,
        projectileMinDamage: 10.0,
        projectileMaxDamage: 10.0,
    },
    mathReload: {
        maxMultiplier: 12,
        minMultiplier: 1,
        correctAnswerReloadTime: 0.5,
        wrongAnswerReloadTime: 5.0,
        normalTimeScale: 1.0,
        mathQuizTimeLimit: 20.0,
        sliderFollowSpeed: 12.0,
    },
    reloadMathTrigger: {
        slowMotionTimeScale: 0.1,
        normalTimeScale: 1.0,
    },
    combatFeel: {
        movementSlowMultiplier: 0.704,
        movementSlowMultiplierFromProjectile: 0.62,
        slowDuration: 1.35,
    },
    spawner: {
        delayBeforeReturnToStart: 3.0,
        navMeshSnapMaxDistance: 8.0,
        spawnGroundRaycastHeight: 25.0,
        spawnGroundRaycastMaxDistance: 50.0,
        loopWaves: false,
    },
    waveAnnouncement: {
        slideInDuration: 0.45,
        holdDuration: 2.2,
        fadeOutDuration: 0.55,
        slidePeekOffset: 56.0,
    },
    navFailsafe: {
        checkInterval: 0.45,
        sampleRadius: 14.0,
        minHeightAboveWalkableNav: 0.55,
        rescueCooldown: 1.5,
        raycastStartHeight: 2.5,
        raycastMaxDistance: 40.0,
    },
    enemyGlobal: {
        healthMultiplier: 1.0,
        walkSpeedMultiplier: 1.0,
    },
    enemyArchetypes: [
        { id: "Boss_Imp_Brown_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "DeepSeaLizard_LightBlue_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "DemonWarrior_WepR_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "Hellguard_Blue_AI", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "Mushroom_Blood_AI", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "RockGolem_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "RockGolem_Sand_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "Slime_Blood_AI", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "Slime_Water_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "SlimeMan_Blood_AI", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "ZombieHound_Red_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
        { id: "Zombie_OldRd_AI Variant", healthMultiplier: 1.0, walkSpeedMultiplier: 1.0, meleeMinDamage: -1.0, meleeMaxDamage: -1.0 },
    ],
    enemyMelee: {
        minDamageCaused: -1.0,
        maxDamageCaused: -1.0,
    },
};
