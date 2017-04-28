# -*- encoding:utf-8 -*-
import sys
import traceback
import uuid
import datetime


class MyException(Exception):
    pass


class DocumentParser:


    def __init__(self, filepath):
        self.uploaded_file = filepath

    @classmethod
    def get_base_document(cls, document_index=0, modified_date=0):
        document_id = uuid.uuid1()
        document_id = str(document_id) + "-{0}".format(document_index)
        document = {"id": document_id
            , "name": None
            , "text": None
            , "status": "READY"
            , "modifiedDate": modified_date}
        return document

    @classmethod
    def get_epoch_time(cls):
        epoch = datetime.datetime.utcfromtimestamp(0)
        return int((datetime.datetime.today() - epoch).total_seconds() * 1000.0)

    def csv_parser(self):
        print self.uploaded_file
        f = open(self.uploaded_file, 'r')
        data = f.read()
        f.close()
        """
        http://www.kimgentes.com/worshiptech-web-tools-page/2008/10/14/regex-pattern-for-parsing-csv-files-with-embedded-commas-dou.html

        ("(?:[^"]|"")*"|[^,]*)*(,("(?:[^"]|"")*"|[^,]*))
        """

        """
        for match in pattern.finditer(data):
            print match.groups()[0]
        """

        offset = 0
        str_buffer = []
        is_name = True
        is_in_quote = False
        documents = []
        document_index = 1
        modified_date = self.get_epoch_time()
        tmp_document = self.get_base_document(document_index=document_index, modified_date=modified_date)

        """에라 모르겠다...정규식은 실패임"""
        try:
            length = len(data)


            iter_data = iter(data)

            for char in iter_data:

                if is_name:
                    if char == ",":
                        tmp_document["name"] = ''.join(str_buffer)
                        str_buffer = []
                        is_name = False

                    else:
                        str_buffer.append(char)

                else:
                    if is_in_quote:
                        if char == '"':
                            if offset + 1 < length and data[offset + 1] == '"':
                                str_buffer.append(char)
                                # str_buffer.append(data[offset + 1])
                                iter_data.next()

                            else:
                                tmp_document["text"] = ''.join(str_buffer)
                                str_buffer = []
                                is_name = True
                                is_in_quote = False
                                documents.append(tmp_document)
                                document_index += 1
                                tmp_document = self.get_base_document(document_index=document_index,
                                                                      modified_date=modified_date)

                        else:
                            str_buffer.append(char)

                    else:
                        if char == '"':
                            is_in_quote = True
                        else:
                            if char == " " or char == "\t":
                                pass
                            else:
                                raise MyException("wrong document format")

                offset += 1
            print documents

        except MyException as e:
            print e
            traceback.print_tb(sys.exc_traceback)
        except Exception as e:
            print e
            traceback.print_tb(sys.exc_traceback)
