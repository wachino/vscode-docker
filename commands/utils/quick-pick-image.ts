/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Docker from 'dockerode';
import vscode = require('vscode');
import { parseError } from 'vscode-azureextensionui';
import { ext } from '../../extensionVariables';
import { docker } from './docker-endpoint';

export interface ImageItem extends vscode.QuickPickItem {
    imageDesc: Docker.ImageDesc
}

function createItem(image: Docker.ImageDesc, repoTag: string): ImageItem {

    return <ImageItem>{
        label: repoTag || '<none>',
        imageDesc: image
    };
}

function computeItems(images: Docker.ImageDesc[], includeAll?: boolean): ImageItem[] {
    const items: ImageItem[] = [];

    // tslint:disable-next-line:prefer-for-of // Grandfathered in
    for (let i = 0; i < images.length; i++) {
        if (!images[i].RepoTags) {
            // dangling
            const item = createItem(images[i], '<none>:<none>');
            items.push(item);
        } else {
            // tslint:disable-next-line:prefer-for-of // Grandfathered in
            for (let j = 0; j < images[i].RepoTags.length; j++) {
                const item = createItem(images[i], images[i].RepoTags[j]);
                items.push(item);
            }
        }

    }

    if (includeAll && images.length > 0) {
        items.unshift(<ImageItem>{
            label: 'All Images'
        });
    }

    return items;
}

/**
 * @throws UserCancelledError
 */
export async function quickPickImage(includeAll?: boolean): Promise<ImageItem> {
    let images: Docker.ImageDesc[];

    const imageFilters = {
        "filters": {
            "dangling": ["false"]
        }
    };

    try {
        images = await docker.getImageDescriptors(imageFilters);
    } catch (error) {
        throw new Error(`Unable to connect to Docker, is the Docker daemon running?\n${parseError(error).message}`);
    }

    if (!images || images.length === 0) {
        throw new Error('There are no docker images. Try Docker Build first.');
    } else {
        const items: ImageItem[] = computeItems(images, includeAll);
        return ext.ui.showQuickPick(items, { placeHolder: 'Choose image...' });
    }
}
