# Project Title
**appschedweb**

# Project Description
_appschedweb_ è un prodotto CSI realizzato a partire da easyappointments-mu(https://github.com/Kuvvu/easyappointments-mu) che a sua volta è un fork pesantemente modificato del progetto GitHub [alextselegidis/easyappointments](https://github.com/alextselegidis/easyappointments).
Per _appschedweb_ si è deciso di partire da easyappointments-mu perché permette la realizzazione del multi tenant.

# Configurations
Il template di file di configurazione si trova nel file *.env.example* che contiene i seguenti parametri.

* BASE_URL: URL sulla quale sarà esposto l'appschedweb, ad esempio *http://comune-esempio.vide.csi.it/appschedweb*;
* MYSQL_SERVER: macchina (o indirizzo) che ospita il server MySQL;
* MYSQL_DATABASE: database MySQL per appschedweb;
* MYSQL_USER: utente impiegato per la connessione al database MySQL;
* MYSQL_PASSWORD: password dell'utente impiegato per la connessione al database MySQL;
* SMTP: indirizzo del mailserver usato per la spedizione delle email;
* SMTP_USER: utente SMTP;
* SMTP_PASS: password dell'utente SMTP;
* VIDE_BASE_URL_API: indirizzo delle API esposte dal modulo VIDE (videoconferenza);
* VIDE_API_PSW: utente usato nella basic authentication delle API VIDE;
* VIDE_API_USER: password dell'utente usato nella basic authentication delle API VIDE;

Appschedweb è multi-tenant, quindi per ogni tenant corrisponde un file di configurazione che deve essere presente nella directory
*storage/mu*; a titolo di esempio, l'applicativo richiamabile alla URL *http://comune-esempio.vide.csi.it/appschedweb* ci sarà
il file di configurazione *storage/mu/comune-esempio.vide.csi.it*.

# Getting Started
Per predisporre il progetto ed avviare il server in locale,  verificare di avere installato sul PC la versione 7.2.x del PHP e
che il composer sia stato installato puntanto alla versione del PHP appena riportata. Inoltre deve essere abilitata l'estensione
*gd2* (extension=gd2) in php.ini (presente nella directory di installazione del PHP impiegato da composer). Poi mandare in esecuzione:

```
composer install
```
che popola la directory _vendor_ con le dipendenze di terze parti.

Per gli sviluppi in locale, utilizzare XAMPP (https://www.apachefriends.org/it/index.html). Eseguirne il download e installarlo sul proprio PC Windows.

Aprire con un editor di testo il file di configurazione di Apache (httpd.conf) presente in XAMPP che è posizionato nella
directory *xampp/apache/conf* e all'interno del tag <IfModule alias_module> inserire

```
Alias /appschedweb <PATH_APPSCHEDWEB>/src
<Directory <PATH_APPSCHEDWEB>/src>
  AllowOverride All
  Options Indexes MultiViews FollowSymLinks
  Require all granted
</Directory>
```
dove _<PATH_APPSCHEDWEB>_ è il path sul proprio disco locale che punta alla directory che ospita appschedweb.

Poi modicare il file _C:\Windows\System32\drivers\etc\hosts_ del proprio PC aggiungendo la riga seguente:

```
127.0.0.1 comune-esempio.vide.csi.it/appschedweb
```

Copiare il file .env.example in _/storage/mu/.comune-esempio.vide.csi.it_ e valorizzare i parametri di configurazione nel seguente modo:
```
PREFIX =
BASE_URL = http://comune-esempio.vide.csi.it/appschedweb/appschedweb
LANGUAGE = italian

MYSQL_SERVER = 127.0.0.1
MYSQL_DATABASE = appsched_comune-esempio_db
MYSQL_USER = appsched_comune-esempio
MYSQL_PASSWORD = 12345678
MYSQL_PORT = 3306
MYSQL_PREFIX =

SMTP = <mailserver_da_usare>
SMTP_USER = <utente_smtp>
SMTP_PASS = <passwd_utente_smtp>

VIDE_BASE_URL_API='<URL_API_VIDE>'
VIDE_API_PSW=mypass
VIDE_API_USER=12345678
```

Aprire come amministratore il pannello di controllo di XAMPP e avviare Apache e MySQL.
Mediante DBeaver - o altro tool - connettersi come root al MySQL in esecuzione su localhost e procedere con la creazione del
database _appsched_comune-esempio_db_ con charset UTF8, e dell'utente _appsched_comune-esempio_ (cfr. file di env del tenant locale),
assegnando i permessi all'utente per poter agire sul database del progetto.

Inserire sulla barra degli indirizzi del browser la URL _http://comune-esempio.vide.csi.it/appschedweb/appschedweb_ che avvia il web
installer per la configurazione dell'istanza di progetto deployata in locale. Scegliere i parametri più consoni alla propria
installazione in locale (admin/12345678) e poi fare click su *Install Easy!Appointment*

I logs applicativi sono presenti nella cartella *storage/logs*

# Prerequisites
I prerequisiti per l'installazione della componente sono i seguenti:

## Software
* [Apache 2.4](https://www.apache.org)
* [MySQL 5.7.x](https://www.mysql.com)
* [Php 7.2.x](https://www.php.net)
* [Composer](https://getcomposer.org/)

## Realizzazione del multi-tenant (su macchine remote)

Per far sì che lo stesso applicativo possa servire più tenant differenti si usano - come documentato in
easyappointments-mu(https://github.com/Kuvvu/easyappointments-mu) - database diversi per ogni hostname.

Dopo aver aggiunto il file .env per il nuovo tenant (ad esempio, .comune-esempio.vide.csi.it all'interno del quale si punta al proprio database
mediante ```MYSQL_USER```), è sufficiente far puntare la configurazione del Web Server alla direcory /src di appschedweb.

# Deployment
TODO

# Versioning
Per la gestione del codice sorgente viene utilizzata la metodologia [Semantic Versioning](https://semver.org/).

# Authors
Gli autori della componente **Appschedweb** sono:

TODO

# Copyrights
(C) Copyright 2020 CSI Piemonte

# License
Questo software è distribuito con licenza [GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html)

Consulta il file [LICENSE.txt](LICENSE.txt) per i dettagli sulla licenza.
