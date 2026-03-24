/**
 * Roversa Pet Companion Extension
 */
//% color="#00A6ED" icon="\uf118" block="Roversa Pet"
namespace roversaPet {
    let trig = DigitalPin.P13
    let echo = DigitalPin.P14

    let stopDistance = 15
    let cautionDistance = 25

    let happiness = 70
    let stress = 20
    let energy = 80

    export enum PetEmotion {
        //% block="happy"
        Happy = 0,
        //% block="curious"
        Curious = 1,
        //% block="scared"
        Scared = 2,
        //% block="tired"
        Tired = 3
    }

    function clamp(value: number): number {
        if (value < 0) return 0
        if (value > 100) return 100
        return value
    }

    /**
     * Set ultrasonic sensor pins
     */
    //% block="set ultrasonic trig %trigPin echo %echoPin"
    //% group="Setup"
    export function setUltrasonicPins(trigPin: DigitalPin, echoPin: DigitalPin): void {
        trig = trigPin
        echo = echoPin
        pins.setPull(echo, PinPullMode.PullNone)
    }

    /**
     * Set stop distance in cm
     */
    //% block="set stop distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=15
    //% group="Setup"
    export function setStopDistance(cm: number): void {
        stopDistance = cm
    }

    /**
     * Set caution distance in cm
     */
    //% block="set caution distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=25
    //% group="Setup"
    export function setCautionDistance(cm: number): void {
        cautionDistance = cm
    }

    /**
     * Set starting pet stats
     */
    //% block="set pet stats happiness %happy stress %tense energy %power"
    //% happy.min=0 happy.max=100 happy.defl=70
    //% tense.min=0 tense.max=100 tense.defl=20
    //% power.min=0 power.max=100 power.defl=80
    //% group="Needs"
    export function setPetStats(happy: number, tense: number, power: number): void {
        happiness = clamp(happy)
        stress = clamp(tense)
        energy = clamp(power)
    }

    /**
     * Distance ahead in cm
     */
    //% block="distance ahead (cm)"
    //% group="Sensor"
    export function distanceCm(): number {
        pins.digitalWritePin(trig, 0)
        control.waitMicros(2)

        pins.digitalWritePin(trig, 1)
        control.waitMicros(10)
        pins.digitalWritePin(trig, 0)

        let duration = pins.pulseIn(echo, PulseValue.High, 25000)

        if (duration <= 0) {
            return 500
        }

        return Math.idiv(duration, 58)
    }

    /**
     * True if obstacle is dangerously close
     */
    //% block="danger detected"
    //% group="Sensor"
    export function dangerDetected(): boolean {
        return distanceCm() <= stopDistance
    }

    /**
     * True if something is nearby
     */
    //% block="something nearby"
    //% group="Sensor"
    export function somethingNearby(): boolean {
        let d = distanceCm()
        return d > stopDistance && d <= cautionDistance
    }

    /**
     * Pet the robot
     */
    //% block="pet robot"
    //% group="Actions"
    export function petRobot(): void {
        happiness = clamp(happiness + 12)
        stress = clamp(stress - 8)
        showFace(PetEmotion.Happy)
    }

    /**
     * Feed the robot
     */
    //% block="feed robot"
    //% group="Actions"
    export function feedRobot(): void {
        energy = clamp(energy + 15)
        happiness = clamp(happiness + 5)
        showFace(PetEmotion.Happy)
    }

    /**
     * Calm the robot
     */
    //% block="calm robot"
    //% group="Actions"
    export function calmRobot(): void {
        stress = clamp(stress - 15)
        showFace(PetEmotion.Curious)
    }

    /**
     * Update needs over time and from surroundings
     */
    //% block="update pet state"
    //% group="Needs"
    export function updatePetState(): void {
        energy = clamp(energy - 1)

        if (dangerDetected()) {
            stress = clamp(stress + 10)
            happiness = clamp(happiness - 4)
        } else if (somethingNearby()) {
            stress = clamp(stress + 2)
        } else {
            stress = clamp(stress - 1)
            happiness = clamp(happiness + 1)
        }

        if (energy < 25) {
            happiness = clamp(happiness - 2)
        }
    }

    /**
     * Return happiness
     */
    //% block="happiness"
    //% group="Needs"
    export function getHappiness(): number {
        return happiness
    }

    /**
     * Return stress
     */
    //% block="stress"
    //% group="Needs"
    export function getStress(): number {
        return stress
    }

    /**
     * Return energy
     */
    //% block="energy"
    //% group="Needs"
    export function getEnergy(): number {
        return energy
    }

    /**
     * Get pet emotion
     */
    //% block="pet emotion"
    //% group="Emotion"
    export function petEmotion(): PetEmotion {
        if (energy < 25) {
            return PetEmotion.Tired
        }

        if (dangerDetected() || stress >= 70) {
            return PetEmotion.Scared
        }

        if (somethingNearby()) {
            return PetEmotion.Curious
        }

        return PetEmotion.Happy
    }

    /**
     * Show a face for the chosen emotion
     */
    //% block="show face %emotion"
    //% group="Emotion"
    export function showFace(emotion: PetEmotion): void {
        if (emotion == PetEmotion.Happy) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                # . . . #
                . # # # .
            `)
        } else if (emotion == PetEmotion.Curious) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . # . .
                . # # # .
                . . . . .
            `)
        } else if (emotion == PetEmotion.Scared) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                # . . . #
            `)
        } else {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                . . . . .
            `)
        }
    }

    /**
     * Show face based on current emotion
     */
    //% block="update face"
    //% group="Emotion"
    export function updateFace(): void {
        showFace(petEmotion())
    }

    /**
     * Show current distance
     */
    //% block="show distance"
    //% group="Sensor"
    export function showDistance(): void {
        basic.showNumber(distanceCm())
    }

    /**
     * Show happiness
     */
    //% block="show happiness"
    //% group="Needs"
    export function showHappiness(): void {
        basic.showNumber(happiness)
    }

    /**
     * Show stress
     */
    //% block="show stress"
    //% group="Needs"
    export function showStress(): void {
        basic.showNumber(stress)
    }

    /**
     * Show energy
     */
    //% block="show energy"
    //% group="Needs"
    export function showEnergy(): void {
        basic.showNumber(energy)
    }
}
