//back
import wideGripLatPullDown from '../assets/video/back/wideGripLatPullDown.mp4'
import pulloverStanding from'../assets/video/back/pulloverStanding.mp4'
import negativePullUps from'../assets/video/back/negativePullUps.mp4'
import upperBlockPull from'../assets/video/back/upperBlockPull.mov'
import closeGripLatPull2 from'../assets/video/back/closeGripLatPull2.mov'
import waistlineCraving from'../assets/video/back/waistlineCraving.mov'
import aryamnovBridge from'../assets/video/back/aryamnovBridge.mov'
import crow from'../assets/video/back/crow.mov'
import сravingForABoat from'../assets/video/back/cravingForABoat.mov'
import closeGripLatPull1 from'../assets/video/back/closeGripLatPull1.mov'
import pulloverLyingDown from'../assets/video/back/pulloverLyingDown.mov'
import circleWithArmsLyingDown from'../assets/video/back/circleWithArmsLyingDown.mov'
import halfPullUp from'../assets/video/back/halfPullUp.mov'
import abductionOfTheArmWithAnElasticBand from'../assets/video/back/abductionOfTheArmWithAnElasticBand.mov'
import boat from'../assets/video/back/boat.mov'
import trapezePullUp from'../assets/video/back/trapezePullUp.mov'
import deadlift from'../assets/video/back/deadlift.mov'
import extensionWithAdduction from'../assets/video/back/extensionWithAdduction.mov'
import tractionInAHummer from'../assets/video/back/tractionInAHummer.mov'
import swimmer from'../assets/video/back/swimmer.mov'
import pullUpFromYogaPose from'../assets/video/back/pullUpFromYogaPose.mov'
import hyperextension from'../assets/video/back/hyperextension.mov'
import pullUpsInTheGravitron from'../assets/video/back/pullUpsInTheGravitron.mov'

//chestArms
import armyPress from'../assets/video/chest-arms/armyPress.mov'
import swingToTheSide from'../assets/video/chest-arms/swingToTheSide.mov'
import bicepsInCrossover from'../assets/video/chest-arms/bicepsInCrossover.mov'
import smithPushUps from'../assets/video/chest-arms/smithPushUps.mov'
import frenchChemLyingDown from'../assets/video/chest-arms/frenchChemLyingDown.mov'
import reversePushUps from'../assets/video/chest-arms/reversePushUps.mov'
import dipsGravitron from'../assets/video/chest-arms/dipsGravitron.mov'
import bicepsStaticDynamic from'../assets/video/chest-arms/bicepsStaticDynamic.mov'
import dumbbellBenchPress from'../assets/video/chest-arms/dumbbellBenchPress.mov'
import platePressUp from'../assets/video/chest-arms/platePressUp.mov'
import tricepsInCrossover from'../assets/video/chest-arms/tricepsInCrossover.mov'
import frenchStandingPress from'../assets/video/chest-arms/frenchStandingPress.mov'
import pushUpsWithAnElasticBand from'../assets/video/chest-arms/pushUpsWithAnElasticBand.mov'
import benchPress from'../assets/video/chest-arms/benchPress.mov'
import negativePushUps from'../assets/video/chest-arms/negativePushUps.mov'
import swingStaticsDynamics from'../assets/video/chest-arms/swingStaticsDynamics.mov'

//warmUp
import shoulderWarmUp from'../assets/video/warm-up/shoulderWarmUp.mov'
import warmUpWithAStick from'../assets/video/warm-up/warmUpWithAStick.mov'
import warmUpOnKnees from'../assets/video/warm-up/warmUpOnKnees.mov'


const warmUp = [
    {
        name: 'Разминка на плечи',
        src: shoulderWarmUp
    },
    {
        name: 'Разминка с палкой',
        src: warmUpWithAStick
    },
    {
        name: 'Разминка на колени',
        src: warmUpOnKnees
    },
    
];

const chestArms = [
    {
        name: 'Армейский жим',
        src: armyPress
    },
    {
        name: 'Махи в сторону',
        src: swingToTheSide
    },
    {
        name: 'Бицепс в кроссовере ',
        src: bicepsInCrossover
    },
    {
        name: 'Отжимания от смита',
        src: smithPushUps
    },
    {
        name: 'Французкий жим лёжа ',
        src: frenchChemLyingDown
    },
    {
        name: 'Обратные отжимания от скамьи',
        src: reversePushUps
    },
    {
        name: 'Отжимания на брусьях(гравитрон)',
        src: dipsGravitron
    },
    {
        name: 'Бицепс <статика+динамика>',
        src: bicepsStaticDynamic
    },
    {
        name: 'Жим гантелей лёжа',
        src: dumbbellBenchPress
    },  
    {
        name: 'Жим блина наверх',
        src: platePressUp
    },  
    {
        name: 'Трицепс в кроссовере',
        src: tricepsInCrossover
    },  
    {
        name: 'Французкий жим стоя',
        src: frenchStandingPress
    }, 
     {
        name: 'Отжимания в резиной',
        src: pushUpsWithAnElasticBand
    },
    {
        name: 'Жим штанги лёжа',
        src: benchPress
    },
    {
        name: 'Негативные отжимания ',
        src: negativePushUps
    },
    {
        name: 'Махи <статика+динамика>',
        src: swingStaticsDynamics
    }, 
];

const back = [  
    {
        name: 'Тяга нижнего блока широким хватом',
        src: wideGripLatPullDown,
    },
    {
        name: 'Пуловер стоя',
        src: pulloverStanding
    },
    {
        name: 'Негативные подтягивания ',
        src: negativePullUps
    },
    {
        name: 'Тяга верхнего блока ',
        src: upperBlockPull
    },
    {
        name: 'Тяга верхнего блока узким хватом',
        src: closeGripLatPull2
    },
    {
        name: 'Тяга к поесу',
        src: waistlineCraving
    },
    {
        name: 'Мост Арямнова',
        src: aryamnovBridge
    },
    {
        name: 'Ворона',
        src: crow
    },
    {
        name: 'Тяга к лодочке ',
        src: сravingForABoat
    },
    {
        name: 'Тяга нижнего блока узким хватом ',
        src: closeGripLatPull1
    },
    {
        name: 'Пуловер лежа',
        src: pulloverLyingDown  
    },
    {
        name: 'Круг руками лёжа',
        src: circleWithArmsLyingDown
    },
    {
        name: 'Полуподтягивание',
        src: halfPullUp
    },
    {
        name: 'Отведение руки с резинкой ',
        src: abductionOfTheArmWithAnElasticBand
    },
    {
        name: 'Лодочка',
        src: boat
    },
    {
        name: 'Подтягивание на трапецию',
        src: trapezePullUp
    },
    {
        name: 'Становая тяга',
        src: deadlift
    },
    {
        name: 'Экстензия с приведением',
        src: extensionWithAdduction
    },
    {
        name: 'Тяга в Хаммере ',
        src: tractionInAHummer
    },
    {
        name: 'Пловец',
        src: swimmer
    },
    {
        name: 'Подтягивание из позы йога ',
        src: pullUpFromYogaPose
    },
    {
        name: 'Гиперэкстензия',
        src: hyperextension
    },
    {
        name: 'Подтягивания в гравитроне',
        src: pullUpsInTheGravitron
    },
];









const legs = [
    {
        name: 'Американский жим',
        src: negativePullUps,
    },
];

const press = [
    {
        name: 'Американский жим',
        src: negativePullUps,
    },
];

export const exercises = [
    {
        name: 'Разминка',
        src: 'https://img.freepik.com/premium-photo/anatomical-illustration-of-muscles-in-the-upper-body-isolated-on-bright-blue-background-ai-generative_955712-12988.jpg',
        url: 'warm-up',
        list: warmUp,
    },
    {
        name: 'Грудь / Руки',
        src: 'https://img.freepik.com/premium-photo/anatomical-illustration-of-muscles-in-the-upper-body-isolated-on-bright-blue-background-ai-generative_955712-12988.jpg',
        url: 'chest-arms',
        list: chestArms,
    },
    {
        name: 'Спина',
        src: 'https://img.freepik.com/premium-photo/anatomical-illustration-of-muscles-in-the-upper-body-isolated-on-bright-blue-background-ai-generative_955712-12988.jpg',
        url: 'back',
        list: back,
    },
    {
        name: 'Ноги',
        src: 'https://img.freepik.com/premium-photo/anatomical-illustration-of-muscles-in-the-upper-body-isolated-on-bright-blue-background-ai-generative_955712-12988.jpg',
        url: 'legs',
        list: legs,
    },
    {
        name: 'Пресс',
        src: 'https://img.freepik.com/premium-photo/anatomical-illustration-of-muscles-in-the-upper-body-isolated-on-bright-blue-background-ai-generative_955712-12988.jpg',
        url: 'press',
        list: press,
    },
];
``