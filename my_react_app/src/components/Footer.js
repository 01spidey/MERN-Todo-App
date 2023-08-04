import React from 'react'
import '../styles/Footer.scss'

const Footer = () => {

    const year = new Date().getFullYear()

    return (
        <div>
            <footer>
                {/* Copyright &copy; {year} */}
                Built with <span role="img" aria-label="love">❤️</span> by Scamander<span role='img' aria-label='wizard'>🪄</span>
            </footer>
        </div>
    )
}

export default Footer