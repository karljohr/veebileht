# Veebileht: SaagiSalong

Veebileht hasartmängu elementidega, kus müüakse loosikaste, mille hinnad on suvalised aga
kindlas vahemikus. Iga päev on poes ka uus kindel “Päevatoode”, mida on ainult 1 eksemplar
ja mille hind langeb päeva möödumise jooksul.

Veebilehe peamine müügiargument on üllatuskastid (lootbox). Kliendid saavad osta üllatuskaste,
mille sisu nad enne kättesaamist ei tea. Samuti ei tea nad kauba kindlat hinda, vaid peavad valima
enda jaoks sobiva hinnavahemiku, nt 1-10 eurot või 20-50 eurot. Üllatuskastist võidetud kaup võib
olla nii füüsiline kui ka virtuaalne. Müügis on ka “Päevatoode (Item of the Day)”: see on kindel
kaup mille sisu kliendid teavad, kuid hind on muutlik. Kui kaup müüki läheb, on hind väga kõrge,
kuid aja jooksul see pidevalt langeb. Kaupa on ainult 1 eksemplar, ehk ainult üks inimene saab
selle osta.

E-pood on mõeldud eelkõige hasartmängusõltuvuse kalduvusega inimestele, kes on samaagselt ka tihe
e-poodide klient. Paljud teised e-poed on tänapäeval väga lihtsad ja igavad, kuid SaagiSalongi
eesmärk on pakkuda lisaks ostlemisele ka elevust ning mängulisust, et shoppamine ei oleks lihtsalt
tüütu tegevus vaid unikaalne kogemus. annab Tegemist on premium-stiilis veebilehega, kus info on
arusaadav, orienteerumine mugav ning puuduvad tüütud reklaamid.

## Projekti Figma link

https://www.figma.com/design/mEBuWAcYSnyzxy3mCmDxQx/Protot%C3%BC%C3%BCp?node-id=0-1&p=f&t=96lNVHYuZ1gN4eCr-0

## Projekti hetkeseis

Projektis on hetkel olemas:

- Avaleht
- Menüü
- Konto loomise alamleht
- Sisselogimise alamleht
- Sisselogimise kinnituse alamleht 
- Konto loomise kinnituse alamleht
- Profiili alamleht
- Päevatoote alamleht
- Tootekataloogi alamleht
- Makseleht
- Ostu kinnituse alamleht
- Algeline sisselogimise backend funktsionaalsus


Projektis on hetkel funktsionaalne:

- Igal alamleheküljel logole vajutades viiakse kasutaja avalehele.
- Menüü avamine igal alamlehel.
- Navigeerimine kõikide olemasolevate alamlehtede vahel.
  - Avalehe nupud "Päevatoode" ja "Saagikastid" viivad vastavatele alamlehekülgedele.
  - Menüü nupud "Avaleht", "Profiil", "Logi Sisse" viivad vastavatele alamlehekülgedele.
  - Sisselogimise alamlehel "Loo kasutaja" tekstiviide viib konto loomise alamlehele.
  - "Logi Sisse", "Loo Kasutaja" ja "Maksa kohe" nupud viivad vastavale kinnituse alamlehele.
- Päevatoote alamlehe nuppude frontend funktsionaalsus
- Tootekataloogi alamlehe nuppude frontend funktsionaalsus

## Projekti tulevik

Projekti on tulevikus veel lisandumas:

- Ostukorvi alamleht
- Arveldusinfo lisamise alamleht
- Salasõna muutmise alamleht
- Kasutaja andmete muutmise alamleht
- Omatud saagikastide alamleht
- Navigeerimine iga lehekülje vahel
- Saagikastide avamise funktsionaalsus
- Kasutaja loomise ning andmete muutmise täiustatud funktsionaalsus

## Kasutatud tehnoloogiad ja raamistikud
- React (versioon 19.2.0)
- Node.js (versioon 22.20.0)
- Vite (versioon 7.1.10)
- PostgreSQL (versioon 17.6)
- express (versioon 4.21.0)

## Projekti lokaalselt käivitamine

1. Kloonida projekti main branch enda IDE-sse
2. Avada projekti main branch enda IDE-s
3. Sisestada terminali käsklus npm install
4. Sisestada terminali käsklus cd .\frontend\
5. Sisestada terminali käsklus npm run dev

## Autorid

Tiim Pingviinid:

- Karl-Johannes Ränkel
- Christofer Toom
- Joonas Reier
