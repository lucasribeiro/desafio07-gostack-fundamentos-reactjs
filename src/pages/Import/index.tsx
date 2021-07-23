import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  async function handleUpload(): Promise<void> {
    console.log(uploadedFiles);
    try {
      await Promise.all(
        uploadedFiles.map(async f => {
          const data = new FormData();
          data.append('name', f.name);
          data.append('file', f.file);
          await api.post('/transactions/import', data);
        }),
      );
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    let fps: FileProps[] = [];
    // eslint-disable-next-line array-callback-return
    files.map(f => {
      const fp: FileProps = {
        file: f,
        name: f.name,
        readableSize: f.size.toString(),
      };
      const newPush = [...fps, fp];
      fps = newPush;
      console.log(fps);
    });
    setUploadedFiles(fps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Importar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
