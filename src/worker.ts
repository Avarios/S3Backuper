import fs from 'fs';
import path from 'path';
import minimist, { ParsedArgs } from 'minimist';

type FleInfo = {
    path: string,
    fileSize?: number
}

const main = async () => {
    try {
        const args = minimist(process.argv);
        const directory = args.path ? path.normalize(args.path) : path.normalize("/data");
        console.log(`processing with args: ${directory}`);
        if (isFolder(directory)) {
            console.log(`Processing Folder: ${directory}`)
            const files = processFolder(directory);
            files.forEach(processFile);
            console.log(`processed ${files.length} Files`);
        } else {
            console.log(`Processing File: ${directory}`)
        }
    } catch (error) {
        console.error(error);
    }

}

const isFolder = (path: string): boolean => {
    return fs.statSync(path).isDirectory();
}

const processFolder = (folderPath: string): Array<FleInfo> => {
    const items = fs.readdirSync(folderPath, { withFileTypes: true });
    const files = new Array<FleInfo>;
    items.forEach(item => {
        if (item.isDirectory()) {
            files.push(...processFolder(path.join(folderPath, item.name)));
            return;
        }
        const filePath = path.join(folderPath, item.name)
        const fileStat = fs.statSync(filePath, { throwIfNoEntry: false });
        files.push({ path: filePath, fileSize: fileStat?.size });
    })
    return files;
}

const processFile = (file: FleInfo): void => {
    console.log(file.path, file.fileSize);
}

main();