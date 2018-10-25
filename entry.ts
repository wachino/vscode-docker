/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const loadStartTime = Date.now();

import * as vscode from 'vscode';
import * as dockerExtension from './dockerExtension';

export async function activate(ctx: vscode.ExtensionContext): Promise<void> {
    dockerExtension.activate(ctx, loadStartTime, loadEndTime);
}

const loadEndTime: number = Date.now();
