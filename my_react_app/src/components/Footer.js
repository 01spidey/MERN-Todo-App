import React from 'react'
import '../styles/Footer.scss'

const Footer = () => {

    const year = new Date().getFullYear()

    return (
        <div>
            <footer>
                Copyright &copy; {year}
            </footer>
        </div>
    )
}

export default Footer