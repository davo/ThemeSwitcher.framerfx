import * as React from "react"
import { useEffect, useState } from "react"
import { Frame, addPropertyControls, ControlType } from "framer"
// import useDetectColorScheme from "./_useDetectColorScheme"

declare global {
    interface Window {
        Vekter: any
        hasDarkAppearance: any
    }
}

interface State {
    theme: string
}

const isCanvas = window.hasOwnProperty("Vekter")
const hasDarkAppearance = window.hasOwnProperty("hasDarkAppearance")

// window.hasDarkAppearance is flag, setup by the Framer X app shell
// /Applications/Framer X Beta.app/Contents/Resources/appearance-script.js

const supportsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches === true

interface Props {
    appearance?: boolean
    default?: string
    darkTheme?: any
    lightTheme?: any
}

export const ThemeSwitcher = (props: Props) => {
    // const autoScheme = useDetectColorScheme("light")
    const [appearance, setAppearance] = useState(false)

    const handleThemeSwitch = event => {
        let _appearance = window.hasDarkAppearance
        setAppearance(_appearance)
    }

    useEffect(() => {
        {
            window.addEventListener("message", handleThemeSwitch)
            return () => {
                window.removeEventListener("message", handleThemeSwitch)
            }
        }
    }, [])

    const darkContent = props.darkTheme.map((frame, i) => {
        const { width, height, id, ...rest } = frame.props

        let overrides = {
            left: 0,
            top: 0,
            size: "100%",
        }

        let key = `${id}_wrapper_${i}`

        return (
            <Frame key={key} size={"100%"} background={null}>
                {React.cloneElement(frame, overrides)}
            </Frame>
        )
    })
    const lightContent = props.lightTheme.map((frame, i) => {
        const { width, height, id, ...rest } = frame.props

        let overrides = {
            left: 0,
            top: 0,
        }

        let key = `${id}_wrapper_${i}`

        return (
            <Frame key={key} size={"100%"} background={null}>
                {React.cloneElement(frame, overrides)}
            </Frame>
        )
    })

    return <>{appearance ? darkContent : lightContent}</>
}

ThemeSwitcher.defaultProps = {
    appearance: null,
}

addPropertyControls(ThemeSwitcher, {
    default: {
        type: ControlType.Boolean,
        title: "Default",
        enabledTitle: "Dark",
        disabledTitle: "Light",
    },
    darkTheme: {
        type: ControlType.Array,
        propertyControl: { type: ControlType.ComponentInstance },
        maxCount: 1,
        title: "Dark",
    },
    lightTheme: {
        type: ControlType.Array,
        propertyControl: { type: ControlType.ComponentInstance },
        maxCount: 1,
        title: "Light",
    },
})
