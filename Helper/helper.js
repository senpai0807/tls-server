import ansiColors from "ansi-colors";

function formatDate(date) {
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
};

function createColorizedLogger(useColor = true) {
    const colors = {
        info: ansiColors.blue,
        verbose: ansiColors.cyan,
        warn: ansiColors.yellow,
        http: ansiColors.magenta,
        silly: ansiColors.green,
        error: ansiColors.red
    };

    const log = async (level, message) => {
        const date = new Date();
        const formattedDate = formatDate(date);
        const formattedLevel = level.toUpperCase();
        const coloredDate = useColor ? colors[level](formattedDate) : formattedDate;
        const coloredType = useColor ? colors[level](formattedLevel) : formattedLevel;
        const coloredMessage = useColor ? colors[level](message) : message;
        const formattedLogMessage = `${coloredDate}: [${coloredType}] | ${coloredMessage}\n`;
        
        setImmediate(() => {
            process.stdout.write(formattedLogMessage);
        });
    };

    return {
        info: (message) => log('info', message),
        verbose: (message) => log('verbose', message),
        warn: (message) => log('warn', message),
        http: (message) => log('http', message),
        silly: (message) => log('silly', message),
        error: (message) => log('error', message)
    };
};

export {
    createColorizedLogger
};