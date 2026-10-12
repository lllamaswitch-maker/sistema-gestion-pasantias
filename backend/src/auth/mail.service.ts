import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import {
  setDefaultResultOrder,
} from 'node:dns';

import {
  existsSync,
} from 'fs';

import {
  join,
} from 'path';


type ObservacionDocumentoCorreo = {
  tipo_documento: string;
  observacion: string;
};


@Injectable()
export class MailService {

  private transporter:
    nodemailer.Transporter;

  private readonly nombreLogo =
    '02-MT-MARCA-2026-BLANCO-HORZ.png';

  private readonly logoCid =
    'logo-miteleferico';


  constructor() {

    setDefaultResultOrder(
      'ipv4first',
    );


    const port =
      Number(
        process.env.MAIL_PORT ||
        587,
      );


    this.transporter =
      nodemailer.createTransport({

        host:
          process.env.MAIL_HOST ||
          'smtp.gmail.com',

        port,

        secure:
          port === 465,

        auth: {
          user:
            process.env.MAIL_USER,

          pass:
            process.env.MAIL_PASS,
        },

        connectionTimeout:
          15000,

        greetingTimeout:
          15000,

        socketTimeout:
          20000,

      });

  }


  private obtenerRutaLogo():
    string | null {

    const rutasPosibles = [

      join(
        process.cwd(),
        '..',
        'frontend',
        'public',
        this.nombreLogo,
      ),

      join(
        process.cwd(),
        'frontend',
        'public',
        this.nombreLogo,
      ),

      join(
        process.cwd(),
        'public',
        this.nombreLogo,
      ),

    ];


    for (
      const ruta
      of rutasPosibles
    ) {

      if (
        existsSync(
          ruta,
        )
      ) {

        return ruta;
      }

    }


    return null;
  }


  private escaparHtml(
    valor:
      string | null | undefined,
  ): string {

    return String(
      valor ?? '',
    )
      .replace(
        /&/g,
        '&amp;',
      )
      .replace(
        /</g,
        '&lt;',
      )
      .replace(
        />/g,
        '&gt;',
      )
      .replace(
        /"/g,
        '&quot;',
      )
      .replace(
        /'/g,
        '&#039;',
      );
  }


  private obtenerNombreDocumento(
    tipoDocumento: string,
  ): string {

    const nombres:
      Record<string, string> = {

        CARTA_SOLICITUD:
          'Carta de Solicitud',

        RECORD_ACADEMICO:
          'Récord Académico',

        HOJA_DE_VIDA:
          'Hoja de Vida',

        FOTOCOPIA_CI:
          'Fotocopia de C.I.',

        FACTURA_SERVICIO_BASICO:
          'Factura de Servicio Básico',

        CROQUIS_DOMICILIO:
          'Croquis de Domicilio',

        REFERENCIAS_PERSONALES:
          'Referencias Personales',

      };


    return (
      nombres[
        tipoDocumento
      ] ||
      tipoDocumento
        .replace(
          /_/g,
          ' ',
        )
    );
  }


  private obtenerAdjuntosLogo() {

    const rutaLogo =
      this.obtenerRutaLogo();


    if (!rutaLogo) {

      console.warn(
        `[MAIL] No se encontró el logo ${this.nombreLogo}. El correo se enviará sin imagen.`,
      );

      return [];
    }


    return [
      {
        filename:
          this.nombreLogo,

        path:
          rutaLogo,

        cid:
          this.logoCid,
      },
    ];
  }


  private obtenerHtmlLogo():
    string {

    const rutaLogo =
      this.obtenerRutaLogo();


    if (!rutaLogo) {

      return `
        <div style="
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
        ">
          MI TELEFÉRICO
        </div>
      `;
    }


    return `
      <img
        src="cid:${this.logoCid}"
        alt="Mi Teleférico"
        style="
          display: block;
          margin: 0 auto;
          max-width: 260px;
          width: 70%;
          height: auto;
        "
      />
    `;
  }


  async enviarCodigoVerificacion(
    destinatario: string,
    nombreCompleto: string,
    codigoOtp: string,
  ) {

    const nombreSeguro =
      this.escaparHtml(
        nombreCompleto,
      );

    const codigoSeguro =
      this.escaparHtml(
        codigoOtp,
      );


    const htmlContenido = `
      <div style="
        background-color: #f1f5f9;
        padding: 30px 15px;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 620px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
        ">

          <div style="
            background-color: #12574c;
            padding: 28px 30px 24px;
            text-align: center;
          ">

            ${this.obtenerHtmlLogo()}

            <p style="
              margin: 16px 0 0;
              color: #d1fae5;
              font-size: 13px;
            ">
              Convocatoria de Pasantías y
              Modalidades de Graduación
            </p>

          </div>


          <div style="
            padding: 30px;
            color: #334155;
            line-height: 1.6;
          ">

            <p style="
              margin-top: 0;
              font-size: 15px;
            ">
              Estimado(a)
              <strong>
                ${nombreSeguro}
              </strong>,
            </p>


            <p style="
              font-size: 14px;
            ">
              Hemos recibido su solicitud de
              pre-registro. Para continuar con su
              postulación y verificar su identidad,
              introduzca el siguiente código de
              seguridad en el sistema:
            </p>


            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <span style="
                display: inline-block;
                font-family: monospace;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #12574c;
                background-color: #f0fdf4;
                padding: 14px 28px;
                border: 2px dashed #12574c;
                border-radius: 10px;
              ">
                ${codigoSeguro}
              </span>

            </div>


            <div style="
              background-color: #fffbeb;
              border-left: 4px solid #f59e0b;
              padding: 14px;
              border-radius: 6px;
              font-size: 12px;
              color: #92400e;
            ">

              <strong>
                Importante:
              </strong>

              Este código es de uso único y tiene
              una validez de

              <strong>
                10 minutos
              </strong>.

            </div>


            <p style="
              font-size: 13px;
              margin-top: 25px;
              color: #64748b;
            ">
              Si usted no solicitó este registro,
              desestime este mensaje.
            </p>

          </div>


          <div style="
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding: 18px 25px;
            font-size: 11px;
            color: #94a3b8;
          ">

            © ${new Date().getFullYear()}
            Mi Teleférico · Gerencia de Gestión
            de Talento Humano

          </div>

        </div>

      </div>
    `;


    try {

      await this.transporter
        .sendMail({

          from:
            process.env.MAIL_FROM ||
            `"Mi Teleférico" <${process.env.MAIL_USER}>`,

          to:
            destinatario,

          subject:
            `Código de Verificación: ${codigoOtp} - Mi Teleférico`,

          html:
            htmlContenido,

          attachments:
            this.obtenerAdjuntosLogo(),

        });


      console.log(
        `[MAIL] Código de verificación enviado a ${destinatario}`,
      );

    } catch (error) {

      console.error(
        '[ERROR NODEMAILER]:',
        error,
      );


      throw new InternalServerErrorException(
        'No se pudo enviar el correo de verificación. Revise la configuración de salida.',
      );

    }

  }


  async enviarObservacionesPostulacion(
    destinatario: string,
    nombreCompleto: string,
    observaciones:
      ObservacionDocumentoCorreo[],
    observacionGeneral?: string,
  ) {

    const observacionesValidas =
      observaciones.filter(
        item =>
          String(
            item.observacion || '',
          ).trim(),
      );


    if (
      observacionesValidas.length === 0
    ) {

      return;
    }


    const nombreSeguro =
      this.escaparHtml(
        nombreCompleto,
      );


    const observacionesHtml =
      observacionesValidas
        .map(
          (
            item,
            index,
          ) => {

            const nombreDocumento =
              this.escaparHtml(
                this.obtenerNombreDocumento(
                  item.tipo_documento,
                ),
              );


            const observacion =
              this.escaparHtml(
                item.observacion,
              );


            return `
              <div style="
                margin-bottom: 14px;
                padding: 16px 18px;
                background-color: #fff7ed;
                border: 1px solid #fed7aa;
                border-left: 5px solid #ea580c;
                border-radius: 10px;
              ">

                <div style="
                  font-size: 13px;
                  font-weight: 700;
                  color: #7c2d12;
                  margin-bottom: 6px;
                ">
                  ${index + 1}. ${nombreDocumento}
                </div>

                <div style="
                  font-size: 13px;
                  color: #475569;
                  line-height: 1.5;
                ">
                  ${observacion}
                </div>

              </div>
            `;
          },
        )
        .join('');


    const observacionGeneralHtml =
      String(
        observacionGeneral || '',
      ).trim()

        ? `
          <div style="
            margin-top: 22px;
            padding: 16px;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
          ">

            <div style="
              font-size: 12px;
              font-weight: 700;
              color: #334155;
              margin-bottom: 6px;
            ">
              Observación general de Talento Humano
            </div>

            <div style="
              font-size: 13px;
              color: #475569;
              line-height: 1.5;
            ">
              ${this.escaparHtml(
                observacionGeneral,
              )}
            </div>

          </div>
        `

        : '';


    const htmlContenido = `
      <div style="
        background-color: #f1f5f9;
        padding: 30px 15px;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width: 660px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
        ">

          <div style="
            background-color: #12574c;
            padding: 28px 30px 24px;
            text-align: center;
          ">

            ${this.obtenerHtmlLogo()}

            <p style="
              margin: 16px 0 0;
              color: #d1fae5;
              font-size: 13px;
            ">
              Gerencia de Gestión de Talento Humano
            </p>

          </div>


          <div style="
            padding: 30px;
          ">

            <div style="
              display: inline-block;
              padding: 7px 12px;
              margin-bottom: 18px;
              background-color: #fff7ed;
              border: 1px solid #fed7aa;
              border-radius: 999px;
              color: #c2410c;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.5px;
            ">
              POSTULACIÓN OBSERVADA
            </div>


            <h2 style="
              margin: 0 0 20px;
              color: #1e293b;
              font-size: 21px;
            ">
              Observaciones en su documentación
            </h2>


            <p style="
              font-size: 14px;
              color: #475569;
              line-height: 1.6;
            ">
              Estimado(a)
              <strong>
                ${nombreSeguro}
              </strong>:
            </p>


            <p style="
              font-size: 14px;
              color: #475569;
              line-height: 1.6;
            ">
              La Gerencia de Gestión de Talento
              Humano realizó la revisión de la
              documentación presentada en su
              postulación. Se identificaron las
              siguientes observaciones:
            </p>


            <div style="
              margin-top: 24px;
            ">

              ${observacionesHtml}

            </div>


            ${observacionGeneralHtml}


            <div style="
              margin-top: 24px;
              padding: 18px;
              background-color: #ecfdf5;
              border: 1px solid #a7f3d0;
              border-radius: 10px;
            ">

              <div style="
                font-size: 13px;
                font-weight: 700;
                color: #065f46;
                margin-bottom: 5px;
              ">
                ¿Qué debe hacer ahora?
              </div>

              <div style="
                font-size: 13px;
                color: #047857;
                line-height: 1.6;
              ">
                Ingrese nuevamente al sistema de
                postulación, revise las observaciones
                indicadas y realice las correcciones
                correspondientes en los documentos
                observados.
              </div>

            </div>


            <p style="
              font-size: 12px;
              color: #64748b;
              line-height: 1.6;
              margin-top: 24px;
            ">
              Este es un mensaje automático generado
              por el Sistema de Gestión de Pasantías
              y Modalidades de Graduación de
              Mi Teleférico.
            </p>

          </div>


          <div style="
            background-color: #f8fafc;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding: 18px 25px;
            font-size: 11px;
            color: #94a3b8;
          ">

            © ${new Date().getFullYear()}
            Mi Teleférico · Gerencia de Gestión
            de Talento Humano

          </div>

        </div>

      </div>
    `;


    try {

      await this.transporter
        .sendMail({

          from:
            process.env.MAIL_FROM ||
            `"Mi Teleférico" <${process.env.MAIL_USER}>`,

          to:
            destinatario,

          subject:
            'Observaciones en su postulación - Mi Teleférico',

          html:
            htmlContenido,

          attachments:
            this.obtenerAdjuntosLogo(),

        });


      console.log(
        `[MAIL] Observaciones de postulación enviadas a ${destinatario}`,
      );

    } catch (error) {

      console.error(
        '[ERROR NODEMAILER - OBSERVACIONES]:',
        error,
      );


      throw new InternalServerErrorException(
        'No se pudo enviar el correo con las observaciones de la postulación.',
      );

    }

  }
  // Un solo mensaje SMTP, con las actividades de cada postulante.
  async enviarPeticionesPasantesRrhh(
    destinatarios: string[],
    datos: {
      area: string;
      supervisor: string;
      fechaSolicitud: Date;
      postulantes: ReadonlyArray<{ nombre: string; actividades: string }>;
    },
  ): Promise<void> {
    if (!destinatarios.length || !datos.postulantes.length) return;
    const fecha = new Intl.DateTimeFormat('es-BO', {
      timeZone: 'America/La_Paz', dateStyle: 'long', timeStyle: 'short',
    }).format(datos.fechaSolicitud);
    const tarjetas = datos.postulantes.map((p, index) => `
      <section style="border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:12px 0;">
        <h3 style="margin:0 0 9px;color:#12574c;">${index + 1}. ${this.escaparHtml(p.nombre)}</h3>
        <div style="font-size:13px;font-weight:bold;margin-bottom:6px;">Actividades propuestas</div>
        <p style="white-space:pre-line;margin:0;font-size:13px;color:#475569;">${this.escaparHtml(p.actividades)}</p>
      </section>
    `).join('');
    const html = `
      <div style="background:#f1f5f9;padding:24px;font-family:Arial,Helvetica,sans-serif;">
        <main style="max-width:660px;margin:auto;background:white;border-radius:14px;overflow:hidden;">
          <header style="background:#12574c;padding:24px;text-align:center;color:white;">
            ${this.obtenerHtmlLogo()}
            <p>Gerencia de Gestión de Talento Humano</p>
          </header>
          <div style="padding:26px;">
            <h2 style="color:#1e293b;">Nueva solicitud de ${datos.postulantes.length} postulante(s)</h2>
            <p><strong>Departamento:</strong> ${this.escaparHtml(datos.area)}</p>
            <p><strong>Supervisor:</strong> ${this.escaparHtml(datos.supervisor)}</p>
            <p><strong>Fecha:</strong> ${this.escaparHtml(fecha)}</p>
            <p>Se registraron las siguientes solicitudes para revisión individual por Talento Humano:</p>
            ${tarjetas}
            <p style="font-size:12px;color:#64748b;">Ingrese al módulo Peticiones de Área para aprobar o rechazar cada solicitud.</p>
          </div>
        </main>
      </div>`;
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || `"Mi Teleférico" <${process.env.MAIL_USER}>`,
      to: destinatarios,
      subject: `Nueva petición de ${datos.postulantes.length} postulante(s) - ${datos.area}`,
      html,
      attachments: this.obtenerAdjuntosLogo(),
    });
  }

  async enviarPeticionPasanteRrhh(
  destinatarios: string[],
  datos: {
    area: string;
    supervisor: string;
    pasante: string;
    fechaSolicitud: Date;
    actividades: string;
  },
) {

  if (
    !Array.isArray(destinatarios) ||
    destinatarios.length === 0
  ) {

    console.warn(
      '[MAIL PETICION] No existen destinatarios RRHH.',
    );

    return;
  }


  const area =
    this.escaparHtml(
      datos.area,
    );

  const supervisor =
    this.escaparHtml(
      datos.supervisor,
    );

  const pasante =
    this.escaparHtml(
      datos.pasante,
    );

  const actividades =
    this.escaparHtml(
      datos.actividades,
    );


  const fecha =
    new Intl.DateTimeFormat(
      'es-BO',
      {
        timeZone:
          'America/La_Paz',

        day:
          '2-digit',

        month:
          'long',

        year:
          'numeric',
      },
    ).format(
      datos.fechaSolicitud,
    );


  const hora =
    new Intl.DateTimeFormat(
      'es-BO',
      {
        timeZone:
          'America/La_Paz',

        hour:
          '2-digit',

        minute:
          '2-digit',

        hour12:
          false,
      },
    ).format(
      datos.fechaSolicitud,
    );


  const htmlContenido = `
    <div style="
      background-color: #f1f5f9;
      padding: 30px 15px;
      font-family: Arial, Helvetica, sans-serif;
    ">

      <div style="
        max-width: 660px;
        margin: 0 auto;
        background-color: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        overflow: hidden;
      ">

        <div style="
          background-color: #12574c;
          padding: 28px 30px 24px;
          text-align: center;
        ">

          ${this.obtenerHtmlLogo()}

          <p style="
            margin: 16px 0 0;
            color: #d1fae5;
            font-size: 13px;
          ">
            Gerencia de Gestión de Talento Humano
          </p>

        </div>


        <div style="
          padding: 30px;
        ">

          <div style="
            display: inline-block;
            padding: 7px 12px;
            margin-bottom: 18px;
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 999px;
            color: #1d4ed8;
            font-size: 11px;
            font-weight: 700;
          ">
            NUEVA PETICIÓN DE PASANTE
          </div>


          <h2 style="
            margin: 0 0 20px;
            color: #1e293b;
            font-size: 21px;
          ">
            Solicitud pendiente de revisión
          </h2>


          <p style="
            font-size: 14px;
            color: #475569;
            line-height: 1.6;
          ">
            Se registró una nueva solicitud de pasante
            realizada por un Supervisor de área.
          </p>


          <div style="
            margin-top: 24px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
          ">

            <div style="
              padding: 14px 16px;
              background-color: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            ">
              <strong style="color:#334155;">
                Área / Departamento
              </strong>

              <div style="
                margin-top: 4px;
                color: #475569;
                font-size: 13px;
              ">
                ${area}
              </div>
            </div>


            <div style="
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
            ">
              <strong style="color:#334155;">
                Supervisor
              </strong>

              <div style="
                margin-top: 4px;
                color: #475569;
                font-size: 13px;
              ">
                ${supervisor}
              </div>
            </div>


            <div style="
              padding: 14px 16px;
              background-color: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            ">
              <strong style="color:#334155;">
                Pasante solicitado
              </strong>

              <div style="
                margin-top: 4px;
                color: #475569;
                font-size: 13px;
              ">
                ${pasante}
              </div>
            </div>


            <div style="
              padding: 14px 16px;
              border-bottom: 1px solid #e2e8f0;
            ">
              <strong style="color:#334155;">
                Fecha
              </strong>

              <div style="
                margin-top: 4px;
                color: #475569;
                font-size: 13px;
              ">
                ${fecha}
              </div>
            </div>


            <div style="
              padding: 14px 16px;
              background-color: #f8fafc;
            ">
              <strong style="color:#334155;">
                Hora
              </strong>

              <div style="
                margin-top: 4px;
                color: #475569;
                font-size: 13px;
              ">
                ${hora}
              </div>
            </div>

          </div>


          <div style="
            margin-top: 22px;
            padding: 16px;
            background-color: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 10px;
          ">

            <div style="
              font-size: 13px;
              font-weight: 700;
              color: #065f46;
              margin-bottom: 7px;
            ">
              Actividades propuestas
            </div>

            <div style="
              font-size: 13px;
              color: #047857;
              line-height: 1.6;
              white-space: pre-line;
            ">
              ${actividades}
            </div>

          </div>


          <div style="
            margin-top: 22px;
            padding: 14px;
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            border-radius: 6px;
            color: #9a3412;
            font-size: 13px;
          ">
            Estado actual:
            <strong>
              PENDIENTE DE REVISIÓN POR TALENTO HUMANO
            </strong>
          </div>


          <p style="
            margin-top: 24px;
            font-size: 12px;
            color: #64748b;
            line-height: 1.6;
          ">
            Ingrese al módulo de Peticiones de Área
            para revisar la solicitud.
          </p>

        </div>


        <div style="
          background-color: #f8fafc;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          padding: 18px 25px;
          font-size: 11px;
          color: #94a3b8;
        ">

          © ${new Date().getFullYear()}
          Mi Teleférico · Gerencia de Gestión
          de Talento Humano

        </div>

      </div>

    </div>
  `;


  try {

    await this.transporter
      .sendMail({

        from:
          process.env.MAIL_FROM ||
          `"Mi Teleférico" <${process.env.MAIL_USER}>`,

        to:
          destinatarios,

        subject:
          `Nueva petición de pasante - ${datos.area}`,

        html:
          htmlContenido,

        attachments:
          this.obtenerAdjuntosLogo(),

      });


    console.log(
      `[MAIL] Petición de pasante enviada a RRHH: ${destinatarios.join(', ')}`,
    );

  } catch (error) {

    console.error(
      '[ERROR NODEMAILER - PETICION PASANTE]:',
      error,
    );


    throw new InternalServerErrorException(
      'No se pudo enviar el correo de la petición de pasante.',
    );

  }

}

}