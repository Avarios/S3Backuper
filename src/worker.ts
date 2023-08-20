import fs from 'fs';
import path from 'path';

type FleInfo = {
    path:string,
    fileSize?:number
}

const main = () => {
    const args = path.normalize(process.argv[2]);
    console.log(`processing with args: ${args}`);
    if (isFolder(args)) {
        console.log(`Processing Folder: ${args}`)
        const files = processFolder(args);
        files.forEach(processFile);
        console.log(`processed ${files.length} Files`);
    } else {
        console.log(`Processing File: ${args}`)
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
        const fileStat = fs.statSync(filePath,{ throwIfNoEntry:false });
        files.push({ path:filePath, fileSize: fileStat?.size });
    })
    return files;
}

const processFile = (file: FleInfo): void => {
    console.log(file.path , file.fileSize);
}

main();