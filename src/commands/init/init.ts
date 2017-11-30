import { join } from 'path';
import {askDefault, close} from '../../utils/promise-readline';
import {which, exec, rm} from 'shelljs';
import { readProjectPackageJSON } from '../../utils/package-json';
import { writeProjectPackageJSON } from '../../utils/package-json/write-package';
import paths from '../../utils/paths';

if (!which('git')) {
    console.error('You need to have git installed :\'(');
    process.exit(1);
}

export async function init () {
    // Read package json and prompt for the project information
    const [projectInfo, packageJSON] = await Promise.all([promptProjectInfo(), readProjectPackageJSON()]);

    // Replace package json defaults
    const newPackage = {
        ...packageJSON,
        version: '0.0.1',
        description: '',
        author: getGitAuthor(),
        name: projectInfo.name,
        license: projectInfo.license
    };

    // Remove post install
    delete newPackage.scripts['postinstall'];

    // Write the new package json back
    await writeProjectPackageJSON(newPackage);

    // Reset git and make first commit
    resetGit(projectInfo.name);
}

// Prompt the user for the project information
async function promptProjectInfo () {
    const folderName = paths.project.split('/').pop();
    const name = await askDefault(`Name [${folderName}]: `, folderName || '');
    const license = await askDefault('License [MIT]: ', 'MIT');
    close();
    return {name, license};
}

// Get a string with the users git info, like "Hernan Rajchert <hrajchert@gmail.com>"
function getGitAuthor () {
    const {name, email} = getGitUserInfo();
    return `${name} <${email}>`;
}

// Reads git user info
function getGitUserInfo () {
    const name = exec('git config user.name', {silent: true}).stdout.toString().trim();
    const email = exec('git config user.email', {silent: true}).stdout.toString().trim();
    return {name, email};
}

function resetGit (projectName: string) {
    // Delete current git
    rm('-rf', join(paths.project, '.git'));
    // Initialize git with a new first commit
    exec(`git init "${paths.project}"`);
    exec('git add .');
    exec(`git commit -m "chore(general): Initialize ${projectName}"`);
}
