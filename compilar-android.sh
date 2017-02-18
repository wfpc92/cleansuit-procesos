#!/bin/sh
echo "*** Compilando Android APK... ***\n"

export HOME_PROJ=$(pwd)

cp release-signing.properties platforms/android/release-signing.properties

ionic build android --release 

cd platforms/android/build/outputs/apk

rm cleansuit-procesos-armv7.apk
rm cleansuit-procesos-x86.apk

echo "*** Firmando versión ARM... ***\n"
/usr/local/java/jdk1.8.0_71/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $HOME_PROJ/cleansuit-procesos.keystore -storepass cleansuitProcesosMCkako.2554 android-armv7-release-unsigned.apk CleansuitAppProcesos
echo "*** Firmando versión x86... ***\n"
/usr/local/java/jdk1.8.0_71/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $HOME_PROJ/cleansuit-procesos.keystore -storepass cleansuitProcesosMCkako.2554 android-x86-release-unsigned.apk CleansuitAppProcesos

echo "*** Optimizando APK ARM... ***\n"
/opt/Android/Sdk/build-tools/23.0.2/zipalign -v 4 android-armv7-release-unsigned.apk cleansuit-procesos-armv7.apk
echo "*** Optimizando APK x86... ***\n"
/opt/Android/Sdk/build-tools/23.0.2/zipalign -v 4 android-x86-release-unsigned.apk cleansuit-procesos-x86.apk


echo "*** Proceso terminado. Revise platforms/android/build/outputs/apk. ***\n"