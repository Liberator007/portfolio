using Microsoft.AspNetCore.Http;
using System;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace News
{
    public class ImageOptimization
    {
        private const string folderRoot = "Images";
        private Stream stream;

        public ImageOptimization(Stream stream)
        {
            this.stream = stream;
        }

        private string GetPathImage()
        {
            string[] paths;
            string path = "";
            bool directoryUniqueness = true;
            string currentDirectory = Directory.GetCurrentDirectory();
            string rootDirectoryPath = Path.Combine(currentDirectory, folderRoot);
            
            while (directoryUniqueness)
            {
                path = "";
                paths = GenerateFolder();
                int pathsLength = paths.Length;

                for(int i = 0; i < pathsLength; i++) 
                {
                    path = Path.Combine(path, paths[i]);
                    if (i != pathsLength - 1) 
                    {
                        if (!Directory.Exists(Path.Combine(rootDirectoryPath, path)))
                        {
                            DirectoryInfo newFolder = new DirectoryInfo(Path.Combine(rootDirectoryPath, path));
                            newFolder.Create();
                            directoryUniqueness = false;
                        }
                    }
                }
            }       
            return path;
        }

        private string[] GenerateFolder()
        {
            string fileName;
            const byte N = 4;
            const byte folderNameLength = 2;
            const byte startIndexFolder1 = 0;
            const byte startIndexFolder2 = 2;
            const byte startIndexFolder3 = 4;
            const byte startIndexFileName = 6;
            string[] paths = new string[N];


            // Генерация имени файла
            fileName = Path.GetRandomFileName();
            int dotIndex = fileName.IndexOf('.');
            fileName = fileName.Substring(dotIndex + 1, fileName.Length - dotIndex - 1);

            // Генерация хеша имени файла, для последущего формирования вложенных каталогов и файла
            byte[] tmpSource = System.Text.Encoding.ASCII.GetBytes(fileName);
            byte[] tmpHash = new MD5CryptoServiceProvider().ComputeHash(tmpSource);
            string filePathHash = ByteArrayToString(tmpHash).ToLower();

            // Первые 3 пути это папки, 4-ый это название файла
            paths[0] = filePathHash.Substring(startIndexFolder1, folderNameLength);
            paths[1] = filePathHash.Substring(startIndexFolder2, folderNameLength);
            paths[2] = filePathHash.Substring(startIndexFolder3, folderNameLength);
            paths[3] = filePathHash.Substring(startIndexFileName);

            return paths;
        }

        public string VaryQualityLevel()
        {
            string getPathImage = GetPathImage();
            string pathImageSave = Path.Combine(Directory.GetCurrentDirectory(), folderRoot, getPathImage);
            using (Bitmap bitmap = new Bitmap(stream))
            {
                ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);
                Encoder encoder = Encoder.Quality;

                EncoderParameters encoderParameters = new EncoderParameters(1);
                EncoderParameter encoderParameter = new EncoderParameter(encoder, 80L);

                encoderParameters.Param[0] = encoderParameter;
                bitmap.Save(pathImageSave, jpgEncoder, encoderParameters);
            }
            return getPathImage;
        }

        private ImageCodecInfo GetEncoder(ImageFormat imageFormat)
        {
            ImageCodecInfo[] imageCodecInfoArray = ImageCodecInfo.GetImageEncoders();
            foreach (ImageCodecInfo imageCodec in imageCodecInfoArray)
            {
                if (imageCodec.FormatID == imageFormat.Guid)
                {
                    return imageCodec;
                }
            }
            return null;
        }

        private string ByteArrayToString(byte[] arrInput)
        {
            int i;
            System.Text.StringBuilder sOutput = new System.Text.StringBuilder(arrInput.Length);
            for (i = 0; i < arrInput.Length - 1; i++)
            {
                sOutput.Append(arrInput[i].ToString("X2"));
            }
            return sOutput.ToString();
        }
    }
}
