import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { AllFilesComponent } from './components/all-files/all-files.component';
import { GetFileByUrlComponent } from './components/get-file-by-url/get-file-by-url.component';

//mapping adress and component
const routes: Routes = [
  { path: '', component: UploadFileComponent},
  { path: 'allFiles', component: AllFilesComponent },
  { path: 'download/:fileUrl', component: GetFileByUrlComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
