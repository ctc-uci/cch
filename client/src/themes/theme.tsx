import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
    components: {
        Td: {
            defaultProps: {
                border: '1px solid',
                borderColor: "#CBD5E0",

            }
        },
        Button: {

            variants: {
                'primary': {
                    size: 'md',
                    variant: 'solid',
                    bg: 'brand.Blue 500',
                    color: 'white',

                    _hover: {
                        size: 'md',
                        variant: 'solid',
                        bg: 'brand.Blue 600',
                        color: 'white',
                    }
                },
                'secondary': {
                    size: 'md',
                    variant: 'outline',
                    borderColor: 'brand.Blue 500',
                    bg: 'white',
                    color: 'brand.Blue 500',
                    border: '1px',
                    _hover: {
                        size: 'md',
                        variant: 'outline',
                        borderColor: 'brand.Blue 500',
                        bg: 'brand.Blue 50',
                        color: 'brand.Blue 500',
                        border: '1px',
                    }
                },
                'tertiary': {
                    size: 'md',
                    variant: 'plain',
                    color: 'brand.Blue 500',
                    bg: 'white',
                    _hover: {
                        size: 'md',
                        variant: 'plain',
                        color: 'brand.Blue 500',
                        bg: 'white',
                        textDecoration: 'underline'
                    }
                },
                'delete': {
                    size: 'md',
                    variant: 'solid',
                    bgColor: '#E53E3E',
                    color: 'white',
                    _hover: {
                        size: 'md',
                        variant: 'solid',
                        bgColor: '#C53030',
                        color: 'white'
                    }
                },
            },

            defaultProps: {
                size: 'md',
                variant: 'solid',
                bgColor: '#3182CE',
            },

        },

        Text: {

            variants: {

                'h1': {
                    fontSize: '3xl',
                    color: 'brand.Gray 700',
                    fontWeight: '800',
                    fontFamily: 'Inter'
                },

                'h2': {
                    fontSize: '2xl',
                    color: 'brand.Blue 500',
                    fontWeight: '700',
                    fontFamily: 'Inter'
                },
                
                'h3': {
                    fontSize: 'xl',
                    color: 'brand.Gray 700',
                    fontWeight: '700',
                    fontFamily: 'Inter'
                },

                'h4': {
                    fontSize: 'md',
                    color:  'brand.Gray 700',
                    fontWeight: '600',
                    fontFamily: 'Inter'
                },
                
                'h5': {
                    fontSize: 'xs',
                    fontWeight: '700',
                    color: 'brand.Gray 600',
                    fontFamily: 'Inter'
                },
                
                'body': {
                    fontSize: 'sm',
                    fontWeight: '500',
                    color:  'brand.Gray 700',
                    fontFamily: 'Inter'
                },
            }
        },

        Link: {
            variants: {
                'hover': {
                    _hover: {
                        color: 'brand.Blue 500',
                        textDecoration: 'none'
                    }
                },
                'select': {
                    color: 'brand.Blue 500',
                    textDecoration: 'underline'
                }
            }
        }
    },

    colors: {
        brand: {
            "Blue 500": "#3182CE",
            "Blue 50":  "#EBF8FF",
            "Blue 100": "#BEE3F8",
            "Blue 200": "#90CDF4",
            "Blue 300": "#63B3ED",
            "Blue 400": "#4299E1",
            "Blue 600": "#2B6CB0",
            "Blue 700": "#2C5282",
            "Blue 900": "#1A365D",
            "Gray 700": "#2D3748",
            "Gray 600": "#4A5568"
        },
    },
})

export default extendTheme(theme);