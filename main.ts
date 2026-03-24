/**
 * Roversa Pet Companion Extension
 */
//% color="#00A6ED" icon="\uf118" block="Roversa Pet"
namespace roversaPet {
    let trig = DigitalPin.P13
    let echo = DigitalPin.P14
    let stopDistance = 15
    let cautionDistance = 25

    export enum PetEmotion {
        //% block="happy"
        Happy = 0,
        //% block="curious"
        Curious = 1,
        //% block="scared"
        Scared = 2
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
    //% group="Thresholds"
    export function setStopDistance(cm: number): void {
        stopDistance = cm
    }

    /**
     * Set caution distance in cm
     */
    //% block="set caution distance to %cm cm"
    //% cm.min=1 cm.max=200 cm.defl=25
    //% group="Thresholds"
    export function setCautionDistance(cm: number): void {
        cautionDistance = cm
    }

    /**
     * Measure distance in cm
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
     * True if obstacle is too close
     */
    //% block="danger detected"
    //% group="Sensor"
    export function dangerDetected(): boolean {
        return distanceCm() <= stopDistance
    }

    /**
     * True if object is nearby but not too close
     */
    //% block="something nearby"
    //% group="Sensor"
    export function somethingNearby(): boolean {
        let d = distanceCm()
        return d > stopDistance && d <= cautionDistance
    }

    /**
     * Get pet emotion from distance
     */
    //% block="pet emotion"
    //% group="Emotion"
    export function petEmotion(): PetEmotion {
        let d = distanceCm()

        if (d <= stopDistance) {
            return PetEmotion.Scared
        } else if (d <= cautionDistance) {
            return PetEmotion.Curious
        } else {
            return PetEmotion.Happy
        }
    }

    /**
     * Show a face for the given emotion
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
        } else {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                # . . . #
            `)
        }
    }

    /**
     * Automatically show current face based on distance
     */
    //% block="update face from distance"
    //% group="Emotion"
    export function updateFaceFromDistance(): void {
        showFace(petEmotion())
    }

    /**
     * Show current distance as a number
     */
    //% block="show distance"
    //% group="Sensor"
    export function showDistance(): void {
        basic.showNumber(distanceCm())
    }
}
