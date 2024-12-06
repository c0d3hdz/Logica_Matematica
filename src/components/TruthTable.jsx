import React, { useState } from 'react'

const extractVariables = expr => {
    const regex = /\b[A-Z]\d+\b/g
    const variables = [...new Set(expr.match(regex) || [])]
    return variables
}

const processExpression = expr => {
    return expr
        .replace(/\bAND\b/g, '&&')
        .replace(/\bOR\b/g, '||')
        .replace(/\bNOT\b/g, '!')
        .replace(/([A-Z]\d+)/g, 'context.$1')
}

const evaluateExpression = (expr, context) => {
    const processedExpr = processExpression(expr)
    try {
        const func = new Function('context', `with (context) { return ${processedExpr} }`)
        return func(context)
    } catch (error) {
        return 'Error'
    }
}
//mejor solucion que encotre para que sirva en el servidor
const generateTruthTable = (expression, useBoolean) => {
    const variables = extractVariables(expression)

    if (variables.length === 0) {
        alert('No se encontraron variables en la expresión.')
        return []
    }
    const rows = []
    const totalRows = Math.pow(2, variables.length)
    // por estudiar este funcionamiento
    for (let i = 0; i < totalRows; i++) {
        const row = []
        for (let j = 0; j < variables.length; j++) {
            row.push((i >> (variables.length - j - 1)) & 1) // Calcula los valores de verdad
        }
        rows.push(row)
    }

    const evaluatedTable = rows.map(row => {
        const context = row.reduce((acc, val, index) => {
            const value = useBoolean ? (val === 1 ? true : false) : val
            acc[variables[index]] = value
            return acc
        }, {})

        const result = evaluateExpression(expression, context)
        return [...row, result]
    })

    return { rows: evaluatedTable, variables }
}

const TruthTableGenerator = () => {
    const [expression, setExpression] = useState('')
    const [table, setTable] = useState([])
    const [useBoolean, setUseBoolean] = useState(false)

    const handleGenerateTable = () => {
        const generatedTable = generateTruthTable(expression, useBoolean)
        setTable(generatedTable)
    }

    return (
        <div className="Container_main">
            <h2>Generador de Tabla de Verdad</h2>
            <div className="container">
                <input
                    type="text"
                    value={expression}
                    onChange={e => setExpression(e.target.value)}
                    name="text"
                    className="input"
                />
                <label className="label text-gradient ">Expresión Booleana:</label>
            </div>
            <br />
            <div className="radio-input">
                <label className=" text-gradient ">True/False </label> <br />
                <input
                    value="value-1"
                    name="value-radio"
                    id="value-1"
                    type="radio"
                    checked={useBoolean === true}
                    onChange={() => setUseBoolean(true)}
                />
                <div className="plus1">
                    <div className="plus2"></div>
                </div>
                <label className="text-gradient ">0/1 </label> <br />
                <input
                    value="value-2"
                    name="value-radio"
                    id="value-2"
                    type="radio"
                    checked={useBoolean === false}
                    onChange={() => setUseBoolean(false)}
                />
                <div className="plus1">
                    <div className="plus2"></div>
                </div>
                <div className="plus1">
                    <div className="plus2"></div>
                </div>
            </div>
            <br /> <br /> <br />
            <button onClick={handleGenerateTable} className="btn">
                <svg
                    height="24"
                    width="24"
                    fill="#FFFFFF"
                    viewBox="0 0 24 24"
                    data-name="Layer 1"
                    id="Layer_1"
                    className="sparkle"
                >
                    <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
                </svg>
                <span className="text"> Generar Tabla</span>
            </button>
            <h3>Tabla de Verdad</h3>
            <p className="instructions ">
                <strong>{expression}</strong>
            </p>
            <div style={{ width: '100%', overflow: 'auto' }}>
                {table.rows && (
                    <table>
                        <thead>
                            <tr>
                                {table.variables.map((variable, i) => (
                                    <th key={i}>{variable}</th>
                                ))}
                                <th>Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {table.rows.map((row, index) => (
                                <tr key={index}>
                                    {row.slice(0, -1).map((cell, i) => (
                                        //ahora se verifica con cell ? '1' : '0' si useBoolean es false, y cell ? 'True' : 'False' si useBoolean es true.
                                        <td key={i}>{useBoolean ? (cell ? 'True' : 'False') : cell ? '1' : '0'} </td>
                                    ))}
                                    <td>
                                        {useBoolean
                                            ? row[row.length - 1]
                                                ? 'True'
                                                : 'False'
                                            : row[row.length - 1]
                                              ? '1'
                                              : '0'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default TruthTableGenerator
